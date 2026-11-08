const KEY = 'pokemon-team';
const makeEmpty = () => ({ version: 1, name: 'My team', pokemonIds: []});

export function saveTeam(team, name) {
    let saveObj = {version: 1, name: name, pokemonIds: team.map(p => p.id)};
    localStorage.setItem(KEY, JSON.stringify(saveObj));
}

export function loadTeam() {
    try {
        console.log('Trying to load data...')
        let load = JSON.parse(localStorage.getItem(KEY));
        console.log(load);
        if (load==null || load.version!=1 || !load.pokemonIds.every(i => Number.isInteger(i))){
            console.log('Found buggy JSON.');
            return makeEmpty();
        }
        console.log('Success!');
        return load;
    } catch {
        console.log('Load data failed. Starting from scratch...')
        return makeEmpty();
    }
}