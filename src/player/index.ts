import { ELO_SCALE_FACTOR } from './constants'

export class Player {
  id: string
  elo: number

  constructor(id: string, elo: number) {
    this.id = id
    this.elo = elo
  }

  getExpectedResult(opponentElo: number) {
    return 1 / (1 + Math.pow(10, (opponentElo - this.elo) / ELO_SCALE_FACTOR))
  }
}
