const PLACEHOLDER = '/placeholder.png';

export function normalizePokemon(raw) {
    return {
        id: raw.id, 
        name: raw.name, 
        image: raw.sprites.other?.['official-artwork']?.front_default ?? raw.sprites?.front_default ?? PLACEHOLDER,
        types: raw.types.map(t => t.type.name),
        stats: raw.stats.map(s => ({
            name: s.stat.name, 
            value: s.base_stat
        })),
        abilities: raw.abilities.map(a => a.ability.name),
    }
}