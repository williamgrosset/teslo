import { Match } from '.'
import { Player } from '../player'

class TestMatch extends Match {
  constructor() {
    super()
  }

  calculate(playerId: string) {}
}

describe('Match', () => {
  test('adds players to match', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const match = new TestMatch()

    match.addPlayer(player1)
    match.addPlayer(player2)

    expect(match.players.size).toBe(2)
  })
})
