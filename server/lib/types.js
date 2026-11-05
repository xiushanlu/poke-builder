let chart = null; // { ground: { electric: 2, grass: 0.5, flying: 0, ... }, ... }
const SKIP = ['stellar', 'shadow', 'unknown']; // not normal battle types; their relations are empty

export async function getChart() {
    if (chart) return chart; // type data never changes: fetch once per server run

    // CHANGED: ?limit=50. PokéAPI lists return 20 per page by default, which can cut types off
    const res = await fetch('https://pokeapi.co/api/v2/type?limit=50');
    if (!res.ok) throw new Error('PokéAPI answered ' + res.status + ' for the type list'); // CHANGED: there's no id here
    const data = await res.json();
    const typeList = data.results;
    const built = {}; // CHANGED: build into a real object; chart is null, and null[x] = ... crashes
    for (let i = 0; i < typeList.length; i++) {
        const typeName = typeList[i].name;
        const typeURL = typeList[i].url;
        if (!SKIP.includes(typeName)) { // CHANGED: the || version was true for every name
            const typeRes = await fetch(typeURL);
            if (!typeRes.ok) throw new Error('PokéAPI answered ' + typeRes.status + ' for type ' + typeName);
            const typeData = await typeRes.json();
            const rel = typeData.damage_relations;
            const mults = {};
            // CHANGED: _to (what this type does when attacking), not _from (what it takes)
            for (const t of rel.no_damage_to) mults[t.name] = 0;
            for (const t of rel.half_damage_to) mults[t.name] = 0.5;
            for (const t of rel.double_damage_to) mults[t.name] = 2;
            built[typeName] = mults;
        }
    }
    chart = built; // CHANGED: save it for next time
    return chart;
}

export function multiplier(chart, attackType, defenderTypes) {
    let mul = 1;
    // CHANGED: const + of (values, not indexes); defenderTypes with the s
    for (const defender of defenderTypes) {
        // CHANGED: missing entry means a normal hit, x1
        mul *= chart[attackType]?.[defender] ?? 1;
    }
    return mul;
}