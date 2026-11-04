import { normalizePokemon } from '../../src/utils/normalize.js'

export async function getPokemonById(id) {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + id);
    console.log(res);
    if (!res.ok) throw new Error('PokéAPI answered ' + res.status + ' for id ' + id);
    const data = await res.json();
    console.log(12390823904582);
    const pokemon = normalizePokemon(data);
    console.log(1232342);
    return pokemon;
}