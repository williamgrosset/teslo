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
  constructor(teams?: Team[], options?: TeamFreeForAllOptions) {
    super({
      minContestants: options?.minTeams,
      maxContestants: options?.maxTeams,
      ...options
    })

    if (teams) {
      this.addTeams(...teams)
    }
  }

  static create(teams?: Team[], options?: TeamFreeForAllOptions): TeamFreeForAll {
    return new TeamFreeForAll(teams, options)
  }

  addTeam(team: Team): this {
    if (this.size === this.maxContestants) {
      throw new MatchError(ErrorType.MAX_TEAMS)
    }

    this.addContestant(team)

    return this
  }

  addTeams(...teams: Team[]): this {
    teams.forEach(team => this.addTeam(team))
    return this
  }

  calculate(teamIds: string[]): TeamResult[] {
    if (this.completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    if (this.size < this.minContestants) {
      throw new MatchError(ErrorType.MIN_TEAMS)
    }

    if (this.size !== teamIds.length) {
      throw new MatchError(ErrorType.SIZE_MISMATCH)
    }

    const teams = this.contestantMapToEloMap()

    for (let i = 0; i < teamIds.length; i++) {
      const team = this.contestants.get(teamIds[i]) as Team

      if (!team) {
        throw new MatchError(ErrorType.TEAM_NOT_FOUND)
      }

      for (const [, player] of team.players) {
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
