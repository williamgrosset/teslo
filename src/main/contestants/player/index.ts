const DEFAULT_ELO_SCALE_FACTOR = 400
const Result = {
  WIN: 1,
  LOSS: 0
}

export class Player {
  id: string
  elo: number

  constructor(id: string, elo: number) {
    this.id = id
    this.elo = elo
  }

  static create(id: string, elo: number): Player {
    return new Player(id, elo)
  }

  getExpectedResult(opponentElo: number): number {
    return (
      1 /
      (1 + Math.pow(10, (opponentElo - this.elo) / DEFAULT_ELO_SCALE_FACTOR))
    )
  }

  calculate(opponentElo: number, won: boolean, kFactor: number): number {
    const result = won ? Result.WIN : Result.LOSS
    const expectedResult = this.getExpectedResult(opponentElo)
    return Math.round(this.elo + kFactor * (result - expectedResult))
  }
}
