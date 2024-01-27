import { Player } from '../player'
import { Match, Options } from '../match/types'
import { K_FACTOR, Result } from '../match/constants'

export class Duel implements Match {
  readonly players: Map<string, Player>
  readonly kFactor: number
  private _completed: boolean

  constructor(options?: Options) {
    this.players = new Map()
    this.kFactor = options?.kFactor ?? K_FACTOR
    this._completed = false
  }

  public get completed(): boolean {
    return this._completed
  }

  private playerMapToEloMap() {
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
    if (this._completed) {
      throw new Error('Match is completed')
    }

    if (this.players.size === 2) {
      throw new Error('Cannot add more than 2 players to a duel')
    }

    this.players.set(player.id, player)
  }

  calculate(playerId: string): void {
    if (this._completed) {
      throw new Error('Match is completed')
    }

    const players = this.playerMapToEloMap()

    for (const [id, player] of this.players) {
      const opponentElo = this.findOpponentElo(players, id)

      if (!opponentElo) {
        throw new Error('Could not find opponent elo')
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
