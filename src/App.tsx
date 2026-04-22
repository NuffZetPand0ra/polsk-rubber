import { useState } from 'react'
import TournamentHome from './components/TournamentHome'
import BoardEntry from './components/BoardEntry'
import type { Tournament } from './types'
import JustPlay from './components/JustPlay'

function App() {
  const [activeTournament, setActiveTournament] = useState<Tournament | null>(null)
  const [justPlay, setJustPlay] = useState(false)

  if (justPlay) {
    return <JustPlay />
  }

  if (activeTournament) {
    return (
      <BoardEntry
        tournament={activeTournament}
        onBack={() => setActiveTournament(null)}
      />
    )
  }

  return <TournamentHome onOpen={setActiveTournament} justPlay={() => setJustPlay(true)} />
}

export default App
