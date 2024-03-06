import { Team } from '../../contestants/team'
import { Match } from '../../../lib/match'
import { Options } from '../../../lib/match/options'
import { TeamResult } from '../../../lib/match/results'
import { MatchError, ErrorType } from '../../../lib/match/error'

interface TeamFreeForAllOptions extends Partial<Pick<Options, 'kFactor'>> {
  minTeams?: number
  maxTeams?: number
}

export class TeamFreeForAll extends Match {
  constructor(options?: TeamFreeForAllOptions) {
    super({
      ...options,
      minContestants: options?.minTeams,
      maxContestants: options?.maxTeams
    })
  }

  addTeam(team: Team): this {
    if (this.contestants.size === this.maxContestants) {
      throw new MatchError(ErrorType.MAX_TEAMS)
    }

    this.addContestant(team)

    return this
  }

  calculate(teamIds: string[]): TeamResult[] {
    if (this.completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    if (this.contestants.size < this.minContestants) {
      throw new MatchError(ErrorType.MIN_TEAMS)
    }

    if (this.contestants.size !== teamIds.length) {
      throw new MatchError(ErrorType.SIZE_MISMATCH)
    }

    const teams = this.contestantMapToEloMap()

    for (let i = 0; i < teamIds.length; i++) {
      const team = this.contestants.get(teamIds[i]) as Team

      if (!team) {
        throw new MatchError(ErrorType.TEAM_NOT_FOUND)
      }

      for (const [_, player] of team.players) {
        let eloDiff = 0

        for (let j = 0; j < teamIds.length; j++) {
          if (i != j) {
            const opponentElo = teams.get(teamIds[j])

            if (!opponentElo) {
              throw new MatchError(ErrorType.MISSING_OPPONENT_ELO)
            }

            eloDiff += player.calculate(opponentElo, j > i, this.kFactor)
          }
        }

        player.elo = Math.floor(eloDiff / (teamIds.length - 1))
      }
    }

    this.completed = true

    return this.contestantMapToResults()
  }
}
