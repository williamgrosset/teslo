import { Player } from '../player'

export interface Options {
  minPlayers?: number
  // TODO Only add support for FFA? Duel should always be 2 players
  maxPlayers?: number
  kFactor?: number
}

export interface Match {
  readonly players: Map<string, Player>
  readonly kFactor: number
  completed: boolean

  addPlayer(player: Player): void

  // TODO Convert Match to abstract class so we can use function overloading instead
  calculate(playerId: string | string[]): void
}
