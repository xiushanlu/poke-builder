import { normalizePokemon } from '../../src/utils/normalize.js'

export async function getPokemonById(id) {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + id);
    if (res.status === 404) {
        const err = new Error('No Pokémon with id ' + id);
        err.code = 'NOT_FOUND';
        throw err;
    }
    if (!res.ok) throw new Error('PokéAPI answered ' + res.status + ' for id ' + id);
    const data = await res.json();
    return normalizePokemon(data);
}