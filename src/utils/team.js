export const MAX_TEAM = 6


export function addToTeam(team, pokemon) {
    let error = null;
    if (team.map(p => p.id).includes(pokemon.id)){
        error = 'duplicate';
    } else if (team.length == MAX_TEAM){
        error = 'full';
    } else {
        team = [...team, pokemon];
    }
    return {team, error};
}

export function removeFromTeam(team, id) {
    return team.filter(p => p.id!=id);
}