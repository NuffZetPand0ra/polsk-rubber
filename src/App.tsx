import { useState } from 'react'
import TournamentHome from './components/TournamentHome'
import BoardEntry from './components/BoardEntry'
import type { Tournament } from './types'
import JustPlay from './components/JustPlay'
import Manuals from './components/Manuals'

function App() {
  const [activeTournament, setActiveTournament] = useState<Tournament | null>(null)
  const [justPlay, setJustPlay] = useState(false)
  const [showManuals, setShowManuals] = useState(false)

  const content = showManuals
    ? <Manuals onBack={() => setShowManuals(false)} />
    : justPlay
    ? <JustPlay />
    : activeTournament
      ? (
          <BoardEntry
            tournament={activeTournament}
            onBack={() => setActiveTournament(null)}
          />
        )
      : (
          <TournamentHome
            onOpen={setActiveTournament}
            justPlay={() => setJustPlay(true)}
            onOpenManuals={() => setShowManuals(true)}
          />
        )

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{content}</main>
      <footer className="border-t border-slate-200 bg-white/80 px-4 py-3 text-center text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
        <span>Open source on </span>
        <a
          href="https://github.com/NuffZetPand0ra/polsk-rubber"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-blue-700 underline hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
        >
          GitHub
        </a>
        <span> • Licensed under </span>
        <a
          href="https://github.com/NuffZetPand0ra/polsk-rubber/blob/main/LICENSE"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-blue-700 underline hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
        >
          MIT
        </a>
      </footer>
    </div>
  )
}

export default App
