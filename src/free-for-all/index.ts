import { Match, Options } from '../match'
import { MatchError, ErrorType } from '../match/error'

export class FreeForAll extends Match {
  constructor(options?: Options) {
    super(options)
  }

  calculate(playerIds: string[]) {
    if (this.completed) {
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

          const elo = this.calculatePlayerElo(player, opponentElo, j > i)

          eloDiff += elo
        }
      }

      player.elo = Math.floor(eloDiff / (playerIds.length - 1))
    }

    this.completed = true
  }
}
