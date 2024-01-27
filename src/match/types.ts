import { Player } from '../player'

export interface Options {
  kFactor?: number
}

export interface Match {
  readonly players: Map<string, Player>
  readonly kFactor: number
  completed: boolean

  addPlayer(player: Player): void
  calculate(playerId: string): void
}
