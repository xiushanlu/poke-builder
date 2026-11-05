import express from 'express'
import cors from 'cors'
import { sendError } from './lib/errors.js'
import { getPokemonById } from './lib/pokeapi.js';
import { getChart, multiplier } from './lib/types.js';

const POOL_MIN = 1;
const POOL_MAX = 151;
const MAX_TEAM = 6;

const app = express() // makes the server
app.use(cors()) // applies the cors func to every request to let the Vite app on another port call this server, called a middleware
app.use(express.json()) // also a middleware, parses JSON bodies (POST, PUT) and puts it into req.body (otherwise req.body == undefined)

app.get('/api/health', (req, res) => res.json({ ok: true })) // for GET requests to /api/health, run res.json({ ok: true })... req = request, res = reply (status 200)... 1:1 req:res

app.get('/api/random-team', async (req, res) => {
    try {
        const randomSet = new Set();
        while (randomSet.size < 6) {
            randomSet.add(Math.floor(Math.random()*151+1));
        }
        const randomTeam = [...randomSet];
        const randomMons = await Promise.all(randomTeam.map(p => getPokemonById(p)));
        res.json(randomMons);
    } catch (err) {
        console.error(err); // the real reason shows in the server terminal
        sendError(res, 502, 'UPSTREAM_FAILED', 'PokéAPI is unavailable. Try again.');
    }
})

app.get('/api/analyze-team', async (req, res) => {
    const {ids} = req.body
    console.log(ids);
    // TODO 1: validate: array, 1 to 6 items, whole numbers, no duplicates → else 400
    if (ids == null || ids.length > MAX_TEAM || ids.length < 1 || Set(ids).size !== size.length) {
        for (const id of ids) {
            if (!Number.isInteger(id)){
                sendError(res, 400, 'INVALID_TEAM', 'Team is invalid. Try again.');
            }
            sendError(res, 400, 'INVALID_TEAM', 'Team is invalid. Try again.');
        }
    }
    // TODO 2: fetch each Pokémon's types (reuse lib/pokeapi.js); upstream failure → 502
    try {
        const team = await Promise.all(ids.map(p => getPokemonById(p)));
        res.json(team);
    } catch (err) {
        console.error(err);
        sendError(res, 502, 'UPSTREAM_FAILED', 'PokéAPI is unavailable. Try again.');
    }
    // TODO 3: for each attack type, count weak / resist / immune across the team
    let chart = getChart();
    let mults = {};
    for (const type of Object.keys(chart)) {
        mults[type] = 1;
    }
    let teamTypes = team.map(p => p.types);
    for (const defenderTypes of teamTypes) {
        for (const attackerType of Object.keys(chart)){
            mults[attackerType] *= multiplier(chart, attackType, defenderTypes);
        }
    }
    // TODO 4: res.json({ ... })   agree on this shape with your team first and write it in the README
    res.json(mults);
})

app.listen(3001, () => console.log('API on http://localhost:3001')) // starts the server, claiming port 3001 and shows the console message when it's ready

export function addToTeam(team, pokemon) {
    let error = null;
    if (team.map(p => p.id).includes(pokemon.id)){
        error = 'duplicate';
    } else if (team.length == MAX_TEAM){
        error = 'full';
    } else {
        team = [...team, pokemon];
    }
    return {team, error};
}