import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import TeamPage from './pages/TeamPage'
import './App.css'
import { addToTeam, removeFromTeam } from './utils/team'

export default function App() {
  const [team, setTeam] = useState([]);
  const [message, setMessage] = useState('')

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
          <Route path="/team" element={<TeamPage onRemove={handleRemove} team={team} onRandom={handleRandom} />} />
        </Routes>
      </main>
    </>
  )
}