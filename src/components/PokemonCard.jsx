export default function PokemonCard({ pokemon, onDetails, add}) {
    function onAdd(){
        add(pokemon);
    }

    return (<div>
        <img alt={pokemon.name} src={pokemon.image}></img>
        <h3>{pokemon.name.split('-').map(s => s[0].toUpperCase()+s.substring(1)).join(' ')}</h3>
        <p>{'#'+pokemon.id.toString().padStart(3, '0')}</p>
        {pokemon.types.map((t, i) => <p className={"type "+t} key={i}>{t}</p>)}
        <button onClick={onDetails}>Details</button>
        <button onClick={onAdd}>Add</button>
    </div>)
}