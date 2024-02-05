import { Match, Options } from '../../lib/match'
import { MatchError, ErrorType } from '../../lib/match/error'

type DuelOptions = Partial<Omit<Options, 'maxPlayers'>>

export class Duel extends Match {
  constructor(options?: DuelOptions) {
    super({ ...options, maxPlayers: 2 })
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

  calculate(playerId: string) {
    if (this.completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    const players = this.playerMapToEloMap()

    for (const [id, player] of this.players) {
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
