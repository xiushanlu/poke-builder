import TeamSlot from '../components/TeamSlot'
import { MAX_TEAM } from '../utils/team'

export default function TeamPage({ team, onRemove }) {
  const slots = Array.from({ length: MAX_TEAM }, (_, i) => team[i])

  if (team.length == 0) {
    return (
      <p>Looks like you have no Pokemon on your team right now. Go the Search to add some!</p>
    )
  }
  
  return (<>
  {slots.map((s, i) => (<TeamSlot pokemon={s} onRemove={onRemove} key={s==null ? 'empty-'+i : s.id}></TeamSlot>))}
  </>)
}