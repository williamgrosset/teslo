import { Match } from '.'
import { Player } from '../../main/contestants/player'
import { ErrorType } from './error'

class TestMatch extends Match {
  constructor() {
    super()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculate(playerId: string) {
    this.completed = true
    return []
  }
}

describe('Match', () => {
  test('adds contestants to match', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const match = new TestMatch()

    match.addContestant(player1)
    match.addContestant(player2)

    expect(match.size).toBe(2)
  })

  test('gets results of match', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const match = new TestMatch()

    match.addContestant(player1)
    match.addContestant(player2)
    match.calculate('1')

    const results = match.getResults()

    expect(results).toStrictEqual([
      {
        id: '1',
        elo: 1000
      },
      {
        id: '2',
        elo: 900
      }
    ])
  })

  test('throws error if getting results before match calculation', () => {
    expect(() => {
      const player1 = new Player('1', 1000)
      const player2 = new Player('2', 900)
      const match = new TestMatch()

      match.addContestant(player1)
      match.addContestant(player2)
      match.getResults()
    }).toThrow(ErrorType.MATCH_INCOMPLETE)
  })
})
