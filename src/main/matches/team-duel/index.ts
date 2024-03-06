import { Team } from '../../contestants/team'
import { Match } from '../../../lib/match'
import { Options, DUEL_SIZE } from '../../../lib/match/options'
import { TeamResult } from '../../../lib/match/results'
import { MatchError, ErrorType } from '../../../lib/match/error'

type TeamDuelOptions = Partial<Pick<Options, 'kFactor'>>

export class TeamDuel extends Match {
  constructor(options?: TeamDuelOptions) {
    super({
      ...options,
      minContestants: DUEL_SIZE,
      maxContestants: DUEL_SIZE
    })
  }

  addTeam(team: Team): this {
    if (this.contestants.size === DUEL_SIZE) {
      throw new MatchError(ErrorType.MAX_TEAMS)
    }

    this.addContestant(team)

    return this
  }

  calculate(teamId: string): TeamResult[] {
    if (this.completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    if (this.contestants.size !== DUEL_SIZE) {
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
