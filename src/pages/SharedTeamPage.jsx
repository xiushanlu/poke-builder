import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TeamSlot from '../components/TeamSlot'
import TeamAnalysis from '../components/TeamAnalysis'

export default function SharedTeamPage() {
    const { shareId } = useParams();
    const [status, setStatus] = useState('loading');
    const [shared, setShared] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch('/api/shared-teams/' + shareId);
                if (res.status === 404) { setStatus('not-found'); return; }
                if (!res.ok) { setStatus('error'); return; }
                setShared(await res.json());
                setStatus('success');
            } catch {
                setStatus('error');
            }
        }
        load();
    }, [shareId]);

    if (status === 'loading') return <p role="status">Loading shared team...</p>;
    if (status === 'not-found') return <p role="alert">This shared team doesn't exist. Check the link.</p>;
    if (status === 'error') return <p role="alert">Couldn't load this team. Try again later.</p>;

    return (<>
        <h3>{shared.name}</h3>
        {shared.team.map(p => <TeamSlot pokemon={p} key={p.id} />)}
    </>);
}