import { useState } from 'react'
import TournamentHome from './components/TournamentHome'
import BoardEntry from './components/BoardEntry'
import type { Tournament } from './types'

function App() {
  const [activeTournament, setActiveTournament] = useState<Tournament | null>(null)

  if (activeTournament) {
    return (
      <BoardEntry
        tournament={activeTournament}
        onBack={() => setActiveTournament(null)}
      />
    )
  }

  return <TournamentHome onOpen={setActiveTournament} />
}

export default App
