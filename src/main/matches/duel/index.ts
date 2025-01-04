import { Player } from '../../contestants/player'
import { Match } from '../../../lib/match'
import { Options, DUEL_SIZE } from '../../../lib/match/options'
import { PlayerResult } from '../../../lib/match/results'
import { MatchError, ErrorType } from '../../../lib/match/error'

type DuelOptions = Partial<Pick<Options, 'kFactor'>>

export class Duel extends Match {
  constructor(players?: Player[], options?: DuelOptions) {
    super({
      minContestants: DUEL_SIZE,
      maxContestants: DUEL_SIZE,
      ...options
    })

    if (players) {
      this.addPlayers(...players)
    }
  }

  static create(players?: Player[], options?: DuelOptions): Duel {
    return new Duel(players, options)
  }

  addPlayer(player: Player): this {
    if (this.size === DUEL_SIZE) {
      throw new MatchError(ErrorType.MAX_PLAYERS)
    }

    this.addContestant(player)

    return this
  }

  addPlayers(...players: Player[]): this {
    players.forEach(player => this.addPlayer(player))
    return this
  }

  calculate(playerId: string): PlayerResult[] {
    if (this.completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    if (this.size !== DUEL_SIZE) {
      throw new MatchError(ErrorType.MIN_PLAYERS)
    }

    const players = this.contestantMapToEloMap()

    for (const [id, contestant] of this.contestants) {
      const player = contestant as Player
      const elos = this.findOpponentElos(id, players)

      if (elos.length === 0) {
        throw new MatchError(ErrorType.MISSING_OPPONENT_ELO)
      }

      const elo = player.calculate(elos[0], playerId === id, this.kFactor)

      player.elo = elo
    }

    this.completed = true

    return this.contestantMapToResults()
  }
}
