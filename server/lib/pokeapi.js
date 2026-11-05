import { normalizePokemon } from '../../src/utils/normalize.js'

export async function getPokemonById(id) {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + id);
    if (!res.ok) throw new Error('PokéAPI answered ' + res.status + ' for id ' + id);
    const data = await res.json();
    const pokemon = normalizePokemon(data);
    return pokemon;
}