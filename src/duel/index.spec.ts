import { Duel } from '.'
import { Player } from '../player'
import { ErrorType } from '../match/error'

describe('Duel', () => {
  test('instantiates with empty constructor', () => {
    const match = new Duel()
    expect(match).toBeDefined()
  })

  test('adds players to match', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const match = new Duel()

    match.addPlayer(player1)
    match.addPlayer(player2)

    expect(match.players.size).toBe(2)
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
    }).toThrow(ErrorType.MAX_SIZE)
  })

  test('calculates elo for player 1 win', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const match = new Duel()

    match.addPlayer(player1)
    match.addPlayer(player2)
    match.calculate('1')

    expect(player1.elo).toBe(1012)
    expect(player2.elo).toBe(888)
  })

  test('calculates elo for player 2 win', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const match = new Duel()

    match.addPlayer(player1)
    match.addPlayer(player2)
    match.calculate('2')

    expect(player1.elo).toBe(980)
    expect(player2.elo).toBe(920)
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
})
