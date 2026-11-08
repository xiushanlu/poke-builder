import TeamSlot from '../components/TeamSlot'
import { MAX_TEAM } from '../utils/team'
import TeamAnalysis from '../components/TeamAnalysis'

export default function TeamPage({ team, onRemove, onRandom, name, setName }) {
  const slots = Array.from({ length: MAX_TEAM }, (_, i) => team[i])
  
  return (<>
  <input type="text" id="teamName" value={name} onChange={(e) => setName(e.target.value)}></input><br></br>
  {team.length == 0 ? (<p>Looks like you have no Pokemon on your team right now. Go to Search to add some!</p>) : slots.map((s, i) => (<TeamSlot pokemon={s} onRemove={onRemove} key={s==null ? 'empty-'+i : s.id}></TeamSlot>))}
  <button onClick={onRandom}>Random team</button>
  <TeamAnalysis key={team.map(p => p.id).join(',')} teamIDs={team.map(p => p.id)} />  </>)
}