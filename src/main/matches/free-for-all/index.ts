import { Player } from '../../contestants/player'
import { Match } from '../../../lib/match'
import { Options } from '../../../lib/match/options'
import { PlayerResult } from '../../../lib/match/results'
import { MatchError, ErrorType } from '../../../lib/match/error'

interface FreeForAllOptions extends Partial<Pick<Options, 'kFactor'>> {
  minPlayers?: number
  maxPlayers?: number
}

export class FreeForAll extends Match {
  constructor(options?: FreeForAllOptions) {
    super({
      ...options,
      minContestants: options?.minPlayers,
      maxContestants: options?.maxPlayers
    })
  }

  static create(options?: FreeForAllOptions, ...players: Player[]): FreeForAll {
    const match = new FreeForAll(options)
    match.addPlayers(...players)
    return match
  }

  addPlayer(player: Player): this {
    if (this.contestants.size === this.maxContestants) {
      throw new MatchError(ErrorType.MAX_PLAYERS)
    }

    this.addContestant(player)

    return this
  }

  addPlayers(...players: Player[]): this {
    players.forEach(player => this.addPlayer(player))
    return this
  }

  calculate(playerIds: string[]): PlayerResult[] {
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

          eloDiff += player.calculate(opponentElo, j > i, this.kFactor)
        }
      }

      player.elo = Math.floor(eloDiff / (playerIds.length - 1))
    }

    this.completed = true

    return this.contestantMapToResults()
  }
}
