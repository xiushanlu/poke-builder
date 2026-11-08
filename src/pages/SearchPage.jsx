import SearchForm from '../components/SearchForm'
import { useState } from 'react'
import { fetchPokemon } from '../api/pokeapi'
import PokemonCard from '../components/PokemonCard'
import DetailModal from '../components/DetailModal'

export default function SearchPage({onAdd}) {
    const [status, setStatus] = useState('idle') // idle | loading | success | not-found | error
    const [pokemon, setPokemon] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    async function handleSearch(query) {
        console.log('search for', query)
        setStatus('loading');
        let fetchStatus = await fetchPokemon(query);
        setStatus(fetchStatus.status);
        if (fetchStatus.status === "success") {
        setPokemon(fetchStatus.pokemon);    
        }
    }

    function onDetails(){
        setModalOpen(true);
    }

    function onClose(){
        setModalOpen(false);
    }

    return (
        <>
        <h2>Search</h2>
        <SearchForm onSearch={handleSearch} disabled={status === "loading"}/>
        <>
            {status === "loading" && <p role="status">Loading...</p>}
            {status === "not-found" && <p role="alert">No Pokémon matched...</p>}
            {status === "error" && <p role="alert">Couldn't reach PokéAPI...</p>}
            {status === "success" && <PokemonCard pokemon={pokemon} onDetails={onDetails} add={onAdd} />}
            {modalOpen && <DetailModal pokemon={pokemon} onClose={onClose}/>}
        </>
        </>
    )
}