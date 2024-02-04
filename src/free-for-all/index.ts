import { Player } from '../player'
import { Match, Options } from '../match/types'
import { MatchError, ErrorType } from '../match/error'

const DEFAULT_MIN_SIZE = 2
const DEFAULT_MAX_SIZE = 256
const DEFAULT_K_FACTOR = 32
const Result = {
  LOSS: 0,
  WIN: 1
}

export class FreeForAll implements Match {
  readonly players: Map<string, Player>
  readonly minPlayers: number
  readonly maxPlayers: number
  readonly kFactor: number
  private _completed: boolean

  constructor(options?: Options) {
    this.players = new Map()
    this.minPlayers = options?.minPlayers ?? DEFAULT_MIN_SIZE
    this.maxPlayers = options?.maxPlayers ?? DEFAULT_MAX_SIZE
    this.kFactor = options?.kFactor ?? DEFAULT_K_FACTOR
    this._completed = false
  }

  get completed(): boolean {
    return this._completed
  }

  private playerMapToEloMap(): Map<string, number> {
    const players = new Map<string, number>()
    for (const [id, player] of this.players) {
      players.set(id, player.elo)
    }
    return players
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

  calculate(playerIds: string[]) {
    if (this._completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    if (this.players.size < this.minPlayers) {
      throw new MatchError(ErrorType.MIN_PLAYERS)
    }

    if (this.players.size !== playerIds.length) {
      throw new MatchError(ErrorType.SIZE_MISMATCH)
    }

    const players = this.playerMapToEloMap()

    for (let i = 0; i < playerIds.length; i++) {
      const player = this.players.get(playerIds[i])

      if (!player) {
        throw new MatchError(ErrorType.PLAYER_NOT_FOUND)
      }

      let eloDiff = 0

      for (let j = 0; j < playerIds.length; j++) {
        if (i != j) {
          const opponentElo = players.get(playerIds[j])

          if (!opponentElo) {
            throw new MatchError(ErrorType.MISSING_OPPONENT_ELO)
          }

          const result = j > i ? Result.WIN : Result.LOSS
          const expectedResult = player.getExpectedResult(opponentElo)
          const elo = Math.round(
            player.elo + this.kFactor * (result - expectedResult)
          )

          eloDiff += elo
        }
      }

      player.elo = Math.floor(eloDiff / (playerIds.length - 1))
    }

    this._completed = true
  }
}
