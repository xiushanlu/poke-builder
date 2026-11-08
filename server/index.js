import express from 'express'
import cors from 'cors'
import { sendError } from './lib/errors.js'
import { getPokemonById } from './lib/pokeapi.js'
import { getChart, multiplier } from './lib/types.js'
import { isValidIds, MAX_TEAM } from './lib/validate.js'
import { supabase } from './supabase.js'

const POOL_MIN = 1;
const POOL_MAX = 1025;

const app = express() // makes the server
app.use(cors()) // applies the cors func to every request to let the Vite app on another port call this server, called a middleware
app.use(express.json()) // also a middleware, parses JSON bodies (POST, PUT) and puts it into req.body (otherwise req.body == undefined)

app.get('/api/health', (req, res) => res.json({ ok: true })) // for GET requests to /api/health, run res.json({ ok: true })... req = request, res = reply (status 200)... 1:1 req:res

app.get('/api/random-team', async (req, res) => {
    try {
        const randomSet = new Set();
        while (randomSet.size < MAX_TEAM) {
            randomSet.add(Math.floor(Math.random()*POOL_MAX+POOL_MIN));
        }
        const randomTeam = [...randomSet];
        const randomMons = await Promise.all(randomTeam.map(p => getPokemonById(p)));
        res.json(randomMons);
    } catch (err) {
        console.error(err); // the real reason shows in the server terminal
        sendError(res, 502, 'UPSTREAM_FAILED', 'PokéAPI is unavailable. Try again.');
    }
})

app.post('/api/analyze-team', async (req, res) => { 
    const { ids } = req.body ?? {};
    if (!isValidIds(ids)) {
        return sendError(res, 400, 'INVALID_TEAM', 'Send 1 to ' + MAX_TEAM + ' different whole-number ids.');
    }

    try { 
        const chart = await getChart(); 
        const team = await Promise.all(ids.map(id => getPokemonById(id)));

        const analysis = {};
        for (const attackType of Object.keys(chart)) { 
            const counts = { weak: 0, resist: 0, immune: 0 }; 
            for (const pokemon of team) {
                const m = multiplier(chart, attackType, pokemon.types);
                if (m === 0) counts.immune++;
                else if (m < 1) counts.resist++;
                else if (m > 1) counts.weak++;
            }
            analysis[attackType] = counts;
        }
        res.json(analysis);
    } catch (err) {
        console.error(err);
        if (err.code === 'NOT_FOUND') return sendError(res, 400, 'INVALID_TEAM', err.message);
        sendError(res, 502, 'UPSTREAM_FAILED', 'PokéAPI is unavailable. Try again.');
    }
});

app.post('/api/shared-teams', async (req, res) => {
    const { name, pokemonIds } = req.body ?? {}

    if (typeof name !== 'string' || !name.trim() || name.trim().length > 60 || !isValidIds(pokemonIds)) {
        return sendError(res, 400, 'INVALID_TEAM', 'Name the team (up to 60 characters) and pick 1 to 6 different Pokémon.')
    }

    try {
        await Promise.all(pokemonIds.map(getPokemonById));
    } catch (err) {
        if (err.code === 'NOT_FOUND') return sendError(res, 400, 'INVALID_TEAM', err.message);
        return sendError(res, 502, 'UPSTREAM_FAILED', 'PokéAPI is unavailable. Try again.');
    }

    const { data, error } = await supabase
        .from('shared_teams')
        .insert({ name: name.trim(), pokemon_ids: pokemonIds })
        .select('share_id')
        .single()

    if (error) {
        console.error(error)
        return sendError(res, 500, 'DB_ERROR', 'Unable to create a share link right now.')
    }
    return res.status(201).json({ shareId: data.share_id })
})

app.get('/api/shared-teams/:shareId', async (req, res) => {
    const { data, error } = await supabase
        .from('shared_teams')
        .select('name, pokemon_ids, created_at')
        .eq('share_id', req.params.shareId)
        .maybeSingle()

    if (error) {
        console.error(error)
        return sendError(res, 500, 'DB_ERROR', 'Unable to load this shared team right now.')
    }
    if (!data) {
        return sendError(res, 404, 'SHARE_NOT_FOUND', 'This shared team does not exist.')
    }

    try {
        const team = await Promise.all(data.pokemon_ids.map(getPokemonById));
        return res.json({ shareId: req.params.shareId, name: data.name, pokemonIds: data.pokemon_ids, createdAt: data.created_at, team });
    } catch (err) {
        console.error(err);
        return sendError(res, 502, 'UPSTREAM_FAILED', 'PokéAPI is unavailable. Try again.');
    }
})

app.listen(3001, () => console.log('API on http://localhost:3001'))