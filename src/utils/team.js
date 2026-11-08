export const MAX_TEAM = 6


export function addToTeam(team, pokemon) {
    let error = null;
    if (team.map(p => p.id).includes(pokemon.id)){
        error = pokemon.name[0].toUpperCase()+pokemon.name.slice(1) + ' is already on your team.';
    } else if (team.length == MAX_TEAM){
        error = 'Your team already has 6 Pokemon!';
    } else {
        team = [...team, pokemon];
    }
    return {team, error};
}

export function removeFromTeam(team, id) {
    return team.filter(p => p.id!=id);
}