const DEFAULT_ELO_SCALE_FACTOR = 400

export class Player {
  id: string
  elo: number

  constructor(id: string, elo: number) {
    this.id = id
    this.elo = elo
  }

  getExpectedResult(opponentElo: number): number {
    return (
      1 /
      (1 + Math.pow(10, (opponentElo - this.elo) / DEFAULT_ELO_SCALE_FACTOR))
    )
  }
}
