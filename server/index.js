import express from 'express'
import cors from 'cors'
import { sendError } from './lib/errors.js'
import { getPokemonById } from './lib/pokeapi.js';

const POOL_MIN = 1;
const POOL_MAX = 151;

const app = express() // makes the server
app.use(cors()) // applies the cors func to every request to let the Vite app on another port call this server, called a middleware
app.use(express.json()) // also a middleware, parses JSON bodies (POST, PUT) and puts it into req.body (otherwise req.body == undefined)

app.get('/api/health', (req, res) => res.json({ ok: true })) // for GET requests to /api/health, run res.json({ ok: true })... req = request, res = reply (status 200)... 1:1 req:res

app.get('/api/random-team', async (req, res) => {
    console.log(1)
    try {
        const randomSet = new Set();
        console.log(2)
        while (randomSet.size < 6) {
            randomSet.add(Math.floor(Math.random()*151+1));
        }
        console.log(3)
        const randomTeam = [...randomSet];
        console.log(4)
        const randomMons = await Promise.all(randomTeam.map(p => getPokemonById(p)));
        console.log(5)
        res.json(randomMons);
    } catch (err) {
        console.error(err)   // the real reason shows in the server terminal
        sendError(res, 502, 'UPSTREAM_FAILED', 'PokéAPI is unavailable. Try again.')
    }
})

app.listen(3001, () => console.log('API on http://localhost:3001')) // starts the server, claiming port 3001 and shows the console message when it's ready