import { Player } from '../player'
import { Match } from '../../lib/match'
import { MatchError, ErrorType } from '../../lib/match/error'

interface FreeForAllOptions {
  minPlayers?: number
  maxPlayers?: number
  kFactor?: number
}

export class FreeForAll extends Match {
  constructor(options?: FreeForAllOptions) {
    super({
      ...options,
      minContestants: options?.minPlayers,
      maxContestants: options?.maxPlayers
    })
  }

  addPlayer(player: Player) {
    if (this.contestants.size === this.maxContestants) {
      throw new MatchError(ErrorType.MAX_PLAYERS)
    }

    this.addContestant(player)
  }

  calculate(playerIds: string[]) {
    if (this.completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    if (this.contestants.size < this.minContestants) {
      throw new MatchError(ErrorType.MIN_PLAYERS)
    }

    if (this.contestants.size !== playerIds.length) {
      throw new MatchError(ErrorType.SIZE_MISMATCH)
    }

    const players = this.contestantMapToEloMap()

    for (let i = 0; i < playerIds.length; i++) {
      const player = this.contestants.get(playerIds[i]) as Player

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

          const elo = player.calculate(opponentElo, j > i, this.kFactor)

          eloDiff += elo
        }
      }

      player.elo = Math.floor(eloDiff / (playerIds.length - 1))
    }

    this.completed = true
  }
}
