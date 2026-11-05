let chart = null // { ground: { electric: 2, grass: 0.5, flying: 0, ... }, ... }

export async function getChart() {
    if (chart) return chart // type data never changes: fetch once per server run

    const res = await fetch('https://pokeapi.co/api/v2/type');
    if (!res.ok) throw new Error('PokéAPI answered ' + res.status + ' for id ' + id);
    const data = await res.json();
    const typeList = data.results;
    for (let i = 0; i < typeList.length; i++) {
        let typeName = typeList[i].name;
        let typeURL = typeList[i].url;
        // we do not account for stellar, shadow, and unknown because they have empty relations
        if (typeName != "stellar" || typeName != "shadow" || typeName != "unknown") {
            const typeRes = await fetch(typeURL);
            if (!typeRes.ok) throw new Error('PokéAPI answered ' + typeRes.status + ' for id ' + id);
            const typeData = await typeRes.json();
            const mults = {};
            typeData.damage_relations.no_damage_from.map(t => mults[t.name] = 0);
            typeData.damage_relations.half_damage_from.map(t => mults[t.name] = 0.5);
            typeData.damage_relations.double_damage_from.map(t => mults[t.name] = 2);
            chart[typeName] = mults;
        }
    }
    return chart;
}

export function multiplier(chart, attackType, defenderTypes) {
    let mul = 1;
    for (const defender of defenderType) {
        if (chart[attackType].keys().includes(defender)){
            mul *= chart[attackType][defender];
        }
    }
    return mul;
}