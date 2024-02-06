import { Player } from '../../main/contestants/player'
import { Team } from '../../main/contestants/team'
import {
  Options,
  DEFAULT_K_FACTOR,
  DEFAULT_MIN_CONTESTANTS,
  DEFAULT_MAX_CONTESTANTS
} from './options'
import { Results } from './results'
import { ErrorType, MatchError } from './error'

type Contestant = Player | Team

export abstract class Match {
  private _contestants: Map<string, Contestant>
  private _completed: boolean
  protected readonly minContestants: number
  protected readonly maxContestants: number
  protected readonly kFactor: number

  constructor(options?: Options) {
    this._contestants = new Map()
    this._completed = false
    this.minContestants = options?.minContestants ?? DEFAULT_MIN_CONTESTANTS
    this.maxContestants = options?.maxContestants ?? DEFAULT_MAX_CONTESTANTS
    this.kFactor = options?.kFactor ?? DEFAULT_K_FACTOR
  }

  get contestants(): Map<string, Contestant> {
    return this._contestants
  }

  get completed(): boolean {
    return this._completed
  }

  protected set completed(completed: boolean) {
    if (this._completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    this._completed = completed
  }

  protected contestantMapToEloMap(): Map<string, number> {
    const elos = new Map<string, number>()

    for (const [id, contestant] of this._contestants) {
      if (contestant instanceof Player) {
        elos.set(id, contestant.elo)
      } else if (contestant instanceof Team) {
        elos.set(id, contestant.getAverageElo())
      }
    }

    return elos
  }

  protected contestantMapToResults(): Results {
    const results = []

    for (const [id, contestant] of this._contestants) {
      if (contestant instanceof Player) {
        const player = { id, elo: contestant.elo }
        results.push(player)
      } else if (contestant instanceof Team) {
        const team = {
          id,
          players: [...contestant.players.values()].map(player => ({
            id: player.id,
            elo: player.elo
          }))
        }
        results.push(team)
      }
    }

    return results as Results
  }

  protected findOpponentElos(
    contestantId: string,
    contestants: Map<string, number>
  ): number[] {
    const elos: number[] = []

    for (const [id, elo] of contestants) {
      if (id !== contestantId) {
        elos.push(elo)
      }
    }

    return elos
  }

  addContestant(contestant: Contestant) {
    if (this._completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    this._contestants.set(contestant.id, contestant)
  }

  abstract calculate(contestantIds: string | string[]): Results
}
