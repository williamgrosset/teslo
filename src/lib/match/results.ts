export interface PlayerResult {
  id: string
  elo: number
}

export interface TeamResult {
  id: string
  players: PlayerResult[]
}

export type Results = PlayerResult[] | TeamResult[]
