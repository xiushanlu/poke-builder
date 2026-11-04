import SearchForm from '../components/SearchForm'
import { useState } from 'react'
import { fetchPokemon } from '../api/pokeapi'

export default function SearchPage() {
    const [status, setStatus] = useState('idle') // idle | loading | success | not-found | error
    const [pokemon, setPokemon] = useState(null)

    async function handleSearch(query) {
        console.log('search for', query)
        setStatus('loading');
        let fetchStatus = await fetchPokemon(query);
        setStatus(fetchStatus.status);
        if (fetchStatus.status === "success") {
        setPokemon(fetchStatus.pokemon);    
        }
    }
    return (
        <>
        <h2>Search</h2>
        <SearchForm onSearch={handleSearch} />
        <>
            {status === "loading" && <p role="status">Loading...</p>}
            {status === "not-found" && <p role="alert">No Pokémon matched...</p>}
            {status === "error" && <p role="alert">Couldn't reach PokéAPI...</p>}
            {status === "success" && <h2>{pokemon.name}</h2>}
        </>
        </>
    )
}