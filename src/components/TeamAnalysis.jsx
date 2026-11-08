import { useState } from 'react'

export default function TeamAnalysis({ teamIDs }) {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)

  async function handleAnalyze() {
    setStatus('loading')
    try {
      const res = await fetch('/api/analyze-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: teamIDs }),
      })
      if (!res.ok) {setMessage(data.error?.message ?? "Couldn't analyze your team."); return;}
      setResult(await res.json())
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section>
      <button onClick={handleAnalyze} disabled={teamIDs.length === 0 || status === 'loading'}>
        Analyze types
      </button>
      {status === 'loading' && <p role="status">Analyzing...</p>}
      {status === 'error' && <p role="alert">Couldn't analyze the team. Try again.</p>}
      {status === 'success' && (
        <table>
          <thead>
            <tr><th>Attack type</th><th>Weak</th><th>Resist</th><th>Immune</th></tr>
          </thead>
          <tbody>
            {Object.entries(result).map(([type, counts]) => (
              <tr key={type}>
                <td>{type}</td>
                <td>{counts.weak}</td>
                <td>{counts.resist}</td>
                <td>{counts.immune}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}