import { Match, Options } from '../../lib/match'
import { MatchError, ErrorType } from '../../lib/match/error'
import { Player } from '../player'

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
      const opponentElo = this.findOpponentElo(players, id)

      if (!opponentElo) {
        throw new MatchError(ErrorType.MISSING_OPPONENT_ELO)
      }

      const elo = player.calculate(opponentElo, playerId === id, this.kFactor)

      player.elo = elo
    }

    this.completed = true
  }
}
