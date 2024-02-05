import { Team } from '../team'
import { MatchError, ErrorType } from '../../lib/match/error'
import { Match, Options } from '../../lib/match'

type TeamDuelOptions = Partial<Pick<Options, 'kFactor'>>

const MIN_TEAMS = 2
const MAX_TEAMS = 2

export class TeamDuel extends Match {
  constructor(options?: TeamDuelOptions) {
    super({ ...options, minContestants: MIN_TEAMS, maxContestants: MAX_TEAMS })
  }

  private findOpponentElo(
    teams: Map<string, number>,
    playerId: string
  ): number | undefined {
    // Assume only 2 entries for a team match
    for (const [id, elo] of teams) {
      if (id !== playerId) {
        return elo
      }
    }
    return undefined
  }

  addTeam(team: Team) {
    if (this.contestants.size === MAX_TEAMS) {
      throw new MatchError(ErrorType.MAX_TEAMS)
    }

    this.addContestant(team)
  }

  calculate(teamId: string) {
    if (this.completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    if (this.contestants.size !== this.minContestants) {
      throw new MatchError(ErrorType.MIN_TEAMS)
    }

    const teams = this.contestantMapToEloMap()

    for (const [id, contestant] of this.contestants) {
      const team = contestant as Team
      const opponentElo = this.findOpponentElo(teams, id)

      if (!opponentElo) {
        throw new MatchError(ErrorType.MISSING_OPPONENT_ELO)
      }

      for (const [_, player] of team.players) {
        const elo = player.calculate(opponentElo, teamId === id, this.kFactor)

        player.elo = elo
      }
    }

    this.completed = true
  }
}
