import { ELO_SCALE_FACTOR } from './constants'

export class Player {
  private _id: string
  private _elo: number

  constructor(id: string, elo: number) {
    this._id = id
    this._elo = elo
  }

  get id(): string {
    return this._id
  }

  set id(id: string) {
    this._id = id
  }

  get elo() {
    return this._elo
  }

  set elo(elo: number) {
    this._elo = elo
  }

  getExpectedResult(opponentElo: number): number {
    return 1 / (1 + Math.pow(10, (opponentElo - this._elo) / ELO_SCALE_FACTOR))
  }
}
