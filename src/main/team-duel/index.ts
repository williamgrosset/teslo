import { Team } from '../team'
import { MatchError, ErrorType } from '../../lib/match/error'
import { Options, DEFAULT_K_FACTOR } from '../../lib/match'

type TeamDuelOptions = Partial<Pick<Options, 'kFactor'>>

const MIN_TEAMS = 2
const MAX_TEAMS = 2

export class TeamDuel {
  teams: Map<string, Team>
  protected readonly kFactor: number
  private _completed: boolean

  constructor(options?: TeamDuelOptions) {
    this.teams = new Map()
    this.kFactor = options?.kFactor ?? DEFAULT_K_FACTOR
    this._completed = false
  }

  get completed(): boolean {
    return this._completed
  }

  private set completed(completed: boolean) {
    if (this._completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    this._completed = completed
  }

  protected teamMapToEloMap(): Map<string, number> {
    const teams = new Map<string, number>()
    for (const [id, team] of this.teams) {
      teams.set(id, team.getAverageElo())
    }
    return teams
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
    if (this.teams.size === MAX_TEAMS) {
      throw new MatchError(ErrorType.MAX_TEAMS)
    }

    this.teams.set(team.id, team)
  }

  calculate(teamId: string) {
    if (this._completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    if (this.teams.size !== MIN_TEAMS) {
      throw new MatchError(ErrorType.MIN_TEAMS)
    }

    const teams = this.teamMapToEloMap()

    for (const [id, team] of this.teams) {
      const opponentElo = this.findOpponentElo(teams, id)

      if (!opponentElo) {
        throw new MatchError(ErrorType.MISSING_OPPONENT_ELO)
      }

      for (const [_, player] of team.players) {
        const elo = player.calculate(opponentElo, teamId === id, this.kFactor)
        player.elo = elo
      }
    }

    this._completed = true
  }
}
