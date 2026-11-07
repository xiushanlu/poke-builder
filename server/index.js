import express from 'express'
import cors from 'cors'
import { sendError } from './lib/errors.js'
import { getPokemonById } from './lib/pokeapi.js';
import { getChart, multiplier } from './lib/types.js';

const POOL_MIN = 1;
const POOL_MAX = 1025;
const MAX_TEAM = 6;

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
    if (!Array.isArray(ids) || ids.length < 1 || ids.length > MAX_TEAM
        || !ids.every(Number.isInteger) || new Set(ids).size !== ids.length) {
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
        sendError(res, 502, 'UPSTREAM_FAILED', 'PokéAPI is unavailable. Try again.');
    }
});

app.listen(3001, () => console.log('API on http://localhost:3001')) // starts the server, claiming port 3001 and shows the console message when it's ready