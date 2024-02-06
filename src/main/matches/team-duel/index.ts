import { Team } from '../../contestants/team'
import { Match } from '../../../lib/match'
import { Options } from '../../../lib/match/options'
import { Results } from '../../../lib/match/results'
import { MatchError, ErrorType } from '../../../lib/match/error'

type TeamDuelOptions = Partial<Pick<Options, 'kFactor'>>

const MIN_TEAMS = 2
const MAX_TEAMS = 2

export class TeamDuel extends Match {
  constructor(options?: TeamDuelOptions) {
    super({ ...options, minContestants: MIN_TEAMS, maxContestants: MAX_TEAMS })
  }

  addTeam(team: Team) {
    if (this.contestants.size === MAX_TEAMS) {
      throw new MatchError(ErrorType.MAX_TEAMS)
    }

    this.addContestant(team)
  }

  calculate(teamId: string): Results {
    if (this.completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    if (this.contestants.size !== MIN_TEAMS) {
      throw new MatchError(ErrorType.MIN_TEAMS)
    }

    const teams = this.contestantMapToEloMap()

    for (const [id, contestant] of this.contestants) {
      const team = contestant as Team
      const elos = this.findOpponentElos(id, teams)

      if (elos.length === 0) {
        throw new MatchError(ErrorType.MISSING_OPPONENT_ELO)
      }

      for (const [_, player] of team.players) {
        const elo = player.calculate(elos[0], teamId === id, this.kFactor)

        player.elo = elo
      }
    }

    this.completed = true

    return this.contestantMapToResults()
  }
}
