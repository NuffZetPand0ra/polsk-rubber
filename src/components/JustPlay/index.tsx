import BoardEntry from '../BoardEntry'

interface Props {
  onExit: () => void
}

export default function JustPlay({ onExit }: Props) {
  // Use a dummy tournament config for single board entry
  const dummyTournament = {
    id: 'just-play',
    name: 'Just Play',
    boardsPerMatch: 1,
    matchFormat: 'vp' as const,
    datumSchema: 'modern' as const,
    createdAt: '',
    players: [],
    sessions: [],
  }

  return (
    <BoardEntry
      tournament={dummyTournament}
      onBack={onExit}
    />
  )
}
