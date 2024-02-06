import { Player } from '../../contestants/player'
import { Match } from '../../../lib/match'
import { Options } from '../../../lib/match/options'
import { MatchError, ErrorType } from '../../../lib/match/error'

type DuelOptions = Partial<Pick<Options, 'kFactor'>>

const MIN_PLAYERS = 2
const MAX_PLAYERS = 2

export class Duel extends Match {
  constructor(options?: DuelOptions) {
    super({
      ...options,
      minContestants: MIN_PLAYERS,
      maxContestants: MAX_PLAYERS
    })
  }

  addPlayer(player: Player) {
    if (this.contestants.size === MAX_PLAYERS) {
      throw new MatchError(ErrorType.MAX_PLAYERS)
    }

    this.addContestant(player)
  }

  calculate(playerId: string) {
    if (this.completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
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
  }
}
