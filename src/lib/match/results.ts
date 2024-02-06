interface PlayerResult {
  id: string
  elo: number
}

interface TeamResult {
  id: string
  players: PlayerResult[]
}

export type Results = PlayerResult[] | TeamResult[]
