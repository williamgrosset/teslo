import { Team } from '../../contestants/team'
import { Match } from '../../../lib/match'
import { Options, DUEL_SIZE } from '../../../lib/match/options'
import { TeamResult } from '../../../lib/match/results'
import { MatchError, ErrorType } from '../../../lib/match/error'

type TeamDuelOptions = Partial<Pick<Options, 'kFactor'>>

export class TeamDuel extends Match {
  constructor(teams?: Team[], options?: TeamDuelOptions) {
    super({
      minContestants: DUEL_SIZE,
      maxContestants: DUEL_SIZE,
      ...options
    })

    if (teams) {
      this.addTeams(...teams)
    }
  }

  static create(teams?: Team[], options?: TeamDuelOptions): TeamDuel {
    return new TeamDuel(teams, options)
  }

  addTeam(team: Team): this {
    if (this.size === DUEL_SIZE) {
      throw new MatchError(ErrorType.MAX_TEAMS)
    }

    this.addContestant(team)

    return this
  }

  addTeams(...teams: Team[]): this {
    teams.forEach(team => this.addTeam(team))
    return this
  }

  calculate(teamId: string): TeamResult[] {
    if (this.completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    if (this.size !== DUEL_SIZE) {
      throw new MatchError(ErrorType.MIN_TEAMS)
    }

    const teams = this.contestantMapToEloMap()

    for (const [id, contestant] of this.contestants) {
      const team = contestant as Team
      const elos = this.findOpponentElos(id, teams)

      if (elos.length === 0) {
        throw new MatchError(ErrorType.MISSING_OPPONENT_ELO)
      }

      for (const [, player] of team.players) {
        const elo = player.calculate(elos[0], teamId === id, this.kFactor)

        player.elo = elo
      }
    }

    this.completed = true

    return this.contestantMapToResults()
  }
}
