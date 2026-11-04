export default function PokemonCard({ pokemon, onDetails }) {
    return <div>
        <img alt={pokemon.name} src={pokemon.image}></img>
        <h3>{pokemon.name.split('-').map(s => s[0].toUpperCase()+s.substring(1)).join(' ')}</h3>
        <p>{'#'+pokemon.id.toString().padStart(3, '0')}</p>
        {pokemon.types.map(t => <p className={"type "+t}>{t}</p>)}
        <button onClick={onDetails}>Details</button>
    </div>
}