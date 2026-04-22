import { useState } from 'react'
import BoardEntry from '../BoardEntry'

export default function JustPlay() {
  // Use a dummy tournament config for single board entry
  const dummyTournament = {
    id: 'just-play',
    name: 'Just Play',
    boardsPerMatch: 1,
    matchFormat: 'vp',
    datumSchema: 'modern',
    createdAt: '',
  }
  const [showEntry, setShowEntry] = useState(true)

  return showEntry ? (
    <BoardEntry
      tournament={dummyTournament}
      onBack={() => setShowEntry(false)}
    />
  ) : (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <button
        className="rounded-lg bg-blue-600 text-white px-6 py-3 text-lg font-semibold shadow hover:bg-blue-700"
        onClick={() => setShowEntry(true)}
      >
        Just Play Again
      </button>
    </div>
  )
}
