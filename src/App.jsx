import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import TeamPage from './pages/TeamPage'
import './App.css'

export default function App() {
  const [team, setTeam] = useState([])

  return (
    <>
      <nav>
        <Link to="/">Search</Link>
        <Link to="/team">Team Size: {team.length}</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/team" element={<TeamPage />} />
        </Routes>
      </main>
    </>
  )
}