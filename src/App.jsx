import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import TeamPage from './pages/TeamPage'
import './App.css'
import { addToTeam, removeFromTeam } from './utils/team'
import { loadTeam, saveTeam } from './utils/storage'
import { getPokemonById } from '../server/lib/pokeapi.js';

export default function App() {
  const [team, setTeam] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('My Team');
  const [isLoading, setIsLoading] = useState(true);
  const [saved] = useState(() => loadFromLocalStorage()); // read local storage only on first render

  useEffect(() => {
    if (!isLoading) {
      saveTeam(team, name);
    }
  }, [team, name, isLoading]) // saves every render where team changes

  async function loadFromLocalStorage(){
    try {
      let load = loadTeam();
      setName(load.name);
      let loaded = await Promise.all(load.pokemonIds.map(p => getPokemonById(p)));
      setTeam(loaded);
    } catch {
      setMessage('Failed to load your team.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleAdd(pokemon) {
    const result = addToTeam(team, pokemon);
    if (result.error != null) {
      setMessage(result.error);
    } else {
      setTeam(result.team);
      setMessage('');
    }
  }

  function handleRemove(id) {
    setTeam(removeFromTeam(team, id));
  }

  async function handleRandom() {
    let response = true;
    if (team.length > 0){
      response = confirm("Do you want to generate a random team? This will replace your current team.");
    } 
    if (response) {
      try {
          const res = await fetch('/api/random-team');
          const data = await res.json();
          if (!res.ok) {setMessage(data.error?.message ?? "Couldn't get a random team."); return;}
          setTeam(data);
          setMessage('');
      } catch {
          setMessage("Couldn't reach the server.");
      }
    }
  }

  return (
    <>
      <nav>
        <Link to="/">Search</Link>
        <Link to="/team">Team Size: {team.length}</Link>
        {message && <p role="status">{message}</p>}
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<SearchPage onAdd={handleAdd} />} />
          <Route path="/team" element={<TeamPage onRemove={handleRemove} team={team} onRandom={handleRandom} name={name} setName={setName}/>} />
        </Routes>
      </main>
    </>
  )
}