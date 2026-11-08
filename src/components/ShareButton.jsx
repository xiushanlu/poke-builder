import { useState } from 'react'

export default function ShareButton({name, team}) {
    const [link, setLink] = useState('')
    const [shareError, setShareError] = useState('')

    async function handleShare() {
        setShareError('')
        try {
            const res = await fetch('/api/shared-teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, pokemonIds: team.map(p => p.id) }),
            })
            const data = await res.json()
            if (!res.ok) { setShareError(data.error?.message ?? "Couldn't create a link."); return }
            setLink(window.location.origin + '/shared/' + data.shareId)
        } catch {
            setShareError("Couldn't reach the server.")
        }
    }

    return (
    <>
        <button onClick={handleShare} disabled={team.length === 0}>Share team</button>
        {shareError && <p role="alert">{shareError}</p>}
        {link && (
            <>
                <label htmlFor="share-link">Share link</label>
                <input id="share-link" value={link} readOnly />
                <button onClick={() => navigator.clipboard.writeText(link)}>Copy</button>
            </>
        )}
    </>
    )
}