import { Player } from '../player'
import { ErrorType, MatchError } from './error'

const DEFAULT_MIN_SIZE = 2
const DEFAULT_MAX_SIZE = 256
const DEFAULT_K_FACTOR = 32
const Result = {
  LOSS: 0,
  WIN: 1
}

export interface Options {
  minPlayers?: number
  maxPlayers?: number
  kFactor?: number
}

export abstract class Match {
  players: Map<string, Player>
  protected readonly minPlayers: number
  protected readonly maxPlayers: number
  private _kFactor: number
  private _completed: boolean

  constructor(options?: Options) {
    this.players = new Map()
    this.minPlayers = options?.minPlayers ?? DEFAULT_MIN_SIZE
    this.maxPlayers = options?.maxPlayers ?? DEFAULT_MAX_SIZE
    this._kFactor = options?.kFactor ?? DEFAULT_K_FACTOR
    this._completed = false
  }

  get completed(): boolean {
    return this._completed
  }

  protected set completed(completed: boolean) {
    if (this._completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    this._completed = completed
  }

  protected playerMapToEloMap(): Map<string, number> {
    const players = new Map<string, number>()
    for (const [id, player] of this.players) {
      players.set(id, player.elo)
    }
    return players
  }

  protected calculatePlayerElo(
    player: Player,
    opponentElo: number,
    won: boolean
  ): number {
    const result = won ? Result.WIN : Result.LOSS
    const expectedResult = player.getExpectedResult(opponentElo)
    return Math.round(player.elo + this._kFactor * (result - expectedResult))
  }

  addPlayer(player: Player) {
    if (this._completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    if (this.players.size === this.maxPlayers) {
      throw new MatchError(ErrorType.MAX_PLAYERS)
    }

    this.players.set(player.id, player)
  }

  abstract calculate(playerId: string | string[]): void
}
