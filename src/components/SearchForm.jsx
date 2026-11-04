import { useState } from 'react'

export default function SearchForm({ onSearch }) {
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (!query.trim()) {
            setError("Type a name or number...");
        } else {
            setError("");
            let searchTerm = query.toLowerCase().trim();
            setQuery(searchTerm);
            onSearch(searchTerm);
            setSubmitted(searchTerm);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="search">Name or Pokédex number</label>
            <input type="text" name="search" id="search" onChange={e => setQuery(e.target.value)} value={query}></input>
            <input type="submit" value="Search"></input>
                {error && <p role="alert">{error}</p>}
                {!error && submitted && <p>Searching for: <strong>{submitted}</strong></p>}
        </form>
    )
}