import { Player } from '../player'
import { Match, Options } from '../match/types'
import { MatchError, ErrorType } from '../match/error'

const DEFAULT_K_FACTOR = 32
const Result = {
  LOSS: 0,
  WIN: 1
}

export class Duel implements Match {
  readonly players: Map<string, Player>
  readonly kFactor: number
  private _completed: boolean

  constructor(options?: Options) {
    this.players = new Map()
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

  private findOpponentElo(
    players: Map<string, number>,
    playerId: string
  ): number | undefined {
    // Assume only 2 entries for a duel match
    for (const [id, elo] of players) {
      if (id !== playerId) {
        return elo
      }
    }
    return undefined
  }

  addPlayer(player: Player) {
    if (this.players.size === 2) {
      throw new MatchError(ErrorType.MAX_SIZE)
    }

    if (this._completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    this.players.set(player.id, player)
  }

  calculate(playerId: string) {
    if (this._completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    const players = this.playerMapToEloMap()

    for (const [id, player] of this.players) {
      const opponentElo = this.findOpponentElo(players, id)

      if (!opponentElo) {
        throw new MatchError(ErrorType.MISSING_OPPONENT_ELO)
      }

      const result = playerId === id ? Result.WIN : Result.LOSS
      const expectedResult = player.getExpectedResult(opponentElo)
      const elo = Math.round(
        player.elo + this.kFactor * (result - expectedResult)
      )

      player.elo = elo
    }

    this._completed = true
  }
}
