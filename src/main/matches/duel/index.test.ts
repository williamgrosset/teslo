import { Duel } from '.'
import { Player } from '../../contestants/player'
import { ErrorType } from '../../../lib/match/error'

describe('Duel', () => {
  test('instantiates with empty constructor', () => {
    const match = new Duel()
    expect(match).toBeDefined()
  })

  test('throws error when adding more than 2 players', () => {
    expect(() => {
      const player1 = new Player('1', 1000)
      const player2 = new Player('2', 900)
      const player3 = new Player('3', 800)
      const match = new Duel()

      match.addPlayer(player1)
      match.addPlayer(player2)
      match.addPlayer(player3)
    }).toThrow(ErrorType.MAX_PLAYERS)
  })

  test('calculates elo for player 1 win', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const match = new Duel()

    match.addPlayer(player1)
    match.addPlayer(player2)

    const results = match.calculate('1')

    expect(results).toStrictEqual([
      {
        id: '1',
        elo: 1012
      },
      {
        id: '2',
        elo: 888
      }
    ])
  })

  test('calculates elo for player 2 win', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const match = new Duel()

    match.addPlayer(player1)
    match.addPlayer(player2)

    const results = match.calculate('2')

    expect(results).toStrictEqual([
      {
        id: '1',
        elo: 980
      },
      {
        id: '2',
        elo: 920
      }
    ])
  })

  test('sets match completion after calculation', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const match = new Duel()

    match.addPlayer(player1)
    match.addPlayer(player2)
    match.calculate('1')

    expect(match.completed).toBe(true)
  })

  test('throws error if trying to calculate when already calculated', () => {
    expect(() => {
      const player1 = new Player('1', 1000)
      const player2 = new Player('2', 900)
      const match = new Duel()

      match.addPlayer(player1)
      match.addPlayer(player2)
      match.calculate('1')
      match.calculate('1')
    }).toThrow(ErrorType.MATCH_COMPLETE)
  })

  test('throws error when calculating elo with missing opponent', () => {
    expect(() => {
      const player1 = new Player('1', 1000)
      const match = new Duel()

      match.addPlayer(player1)
      match.calculate('1')
    }).toThrow(ErrorType.MISSING_OPPONENT_ELO)
  })
})
