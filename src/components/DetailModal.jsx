import { useEffect, useRef } from 'react'

export default function DetailModal({ pokemon, onClose }) {
    const closeRef = useRef(null)

    useEffect(() => {
        closeRef.current?.focus()
        function onKey(e) { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [onClose])

    function handleBackdrop(e) {
        if(e.currentTarget === e.target) {
        onClose();
        }
    }

    return (
        <div className="backdrop" onClick={handleBackdrop}>
        <div role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <img alt={pokemon.name} src={pokemon.image}></img>
            <h3>{pokemon.name.split('-').map(s => s[0].toUpperCase()+s.substring(1)).join(' ')}</h3>
            <p>{'#'+pokemon.id.toString().padStart(3, '0')}</p>
            {pokemon.types.map(t => <p className={"type "+t}>{t}</p>)}
            <h4>Abilities</h4>
            {pokemon.abilities.map(a => (<p>{a}</p>))}
            <h4>Base Stats</h4>
            {pokemon.stats.map(s => (<div className="statsRow"><p className="stat">{s.name}</p><p className="statValue">{s.value}</p></div>))}
            <button ref={closeRef} onClick={onClose}>Close</button>
        </div>
        </div>
    )
}