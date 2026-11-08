export default function TeamSlot({pokemon, onRemove}) {      
    if (pokemon == undefined) {
        return <div className="teamslot"><p>Looks like there's room for a Pokemon here. Add one via the Search!</p></div>
    }

    function remove() {
        onRemove(pokemon.id);
    }

    return (<div className="teamslot">
        <img alt={pokemon.name} src={pokemon.image}></img>
        <h3>{pokemon.name.split('-').map(s => s[0].toUpperCase()+s.substring(1)).join(' ')}</h3>
        <p>{'#'+pokemon.id.toString().padStart(3, '0')}</p>
        {pokemon.types.map((t, i) => <p className={"type "+t} key={i}>{t}</p>)}
        {onRemove && <button onClick={remove}>Remove</button>}
    </div>)
}