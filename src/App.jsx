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
    try {
        const res = await fetch('/api/random-team');
        console.log(res);
        const newTeam = await res.json();
        console.log(newTeam);
        setTeam(newTeam);
    } catch {
        setMessage("error");
    }
  }

  function handleAnalyze() {

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