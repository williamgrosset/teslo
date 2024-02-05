import { Player } from '../../main/player'
import { Team } from '../../main/team'
import { ErrorType, MatchError } from './error'

export interface Options {
  minContestants?: number
  maxContestants?: number
  kFactor?: number
}

type Contestant = Player | Team

const DEFAULT_K_FACTOR = 32
const DEFAULT_MIN_SIZE = 2
const DEFAULT_MAX_SIZE = 256

export abstract class Match {
  private _contestants: Map<string, Contestant>
  private _completed: boolean
  protected readonly minContestants: number
  protected readonly maxContestants: number
  protected readonly kFactor: number

  constructor(options?: Options) {
    this._contestants = new Map()
    this._completed = false
    this.minContestants = options?.minContestants ?? DEFAULT_MIN_SIZE
    this.maxContestants = options?.maxContestants ?? DEFAULT_MAX_SIZE
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
    const players = new Map<string, number>()

    for (const [id, contestant] of this._contestants) {
      if (contestant instanceof Player) {
        players.set(id, contestant.elo)
      } else if (contestant instanceof Team) {
        players.set(id, contestant.getAverageElo())
      }
    }

    return players
  }

  addContestant(contestant: Contestant) {
    if (this._completed) {
      throw new MatchError(ErrorType.MATCH_COMPLETE)
    }

    this._contestants.set(contestant.id, contestant)
  }

  abstract calculate(playerId: string | string[]): void
}
