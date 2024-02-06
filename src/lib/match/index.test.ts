import { Match } from '.'
import { Player } from '../../main/contestants/player'

class TestMatch extends Match {
  constructor() {
    super()
  }

  calculate(playerId: string) {}
}

describe('Match', () => {
  test('adds contestants to match', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const match = new TestMatch()

    match.addContestant(player1)
    match.addContestant(player2)

    expect(match.contestants.size).toBe(2)
  })
})
