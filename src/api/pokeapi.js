import { normalizePokemon } from '../utils/normalize'

const BASE = 'https://pokeapi.co/api/v2/pokemon/'

export async function fetchPokemon(query) {
    const name = encodeURIComponent(query.trim().toLowerCase().replace(/[.']/g, '').replace(/\s+/g, '-'));
    try {
        const res = await fetch(BASE + name);
        if (res.status === 404) { return {status: 'not-found'} }
        if (!res.ok) { return {status: 'error'} }
        const data = await res.json();
        const pokemon = normalizePokemon(data);
        return {status: 'success', pokemon};
    }
    catch {
        return {status: 'error'};
    }
}