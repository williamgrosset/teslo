import { FreeForAll } from '.'
import { ErrorType } from '../match/error'
import { Player } from '../player'

describe('FreeForAll', () => {
  test('instantiates with empty constructor', () => {
    const match = new FreeForAll()
    expect(match).toBeDefined()
  })

  test('calculates elo for player 1 win with 2 players', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const match = new FreeForAll()

    match.addPlayer(player1)
    match.addPlayer(player2)
    match.calculate(['1', '2'])

    expect(player1.elo).toBe(1012)
    expect(player2.elo).toBe(888)
  })

  test('calculates elo for player 2 win with 2 players', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const match = new FreeForAll()

    match.addPlayer(player1)
    match.addPlayer(player2)
    match.calculate(['2', '1'])

    expect(player1.elo).toBe(980)
    expect(player2.elo).toBe(920)
  })

  test('calculates elo for player 1 win with 3 players', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const player3 = new Player('3', 800)
    const match = new FreeForAll()

    match.addPlayer(player1)
    match.addPlayer(player2)
    match.addPlayer(player3)
    match.calculate(['1', '2', '3'])

    expect(player1.elo).toBe(1010)
    expect(player2.elo).toBe(900)
    expect(player3.elo).toBe(790)
  })

  test('calculates elo for player 2 win with 3 players', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const player3 = new Player('3', 800)
    const match = new FreeForAll()

    match.addPlayer(player1)
    match.addPlayer(player2)
    match.addPlayer(player3)
    match.calculate(['2', '3', '1'])

    expect(player1.elo).toBe(978)
    expect(player2.elo).toBe(916)
    expect(player3.elo).toBe(806)
  })

  test('calculates elo for player 3 win with 3 players', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const player3 = new Player('3', 800)
    const match = new FreeForAll()

    match.addPlayer(player1)
    match.addPlayer(player2)
    match.addPlayer(player3)
    match.calculate(['3', '2', '1'])

    expect(player1.elo).toBe(978)
    expect(player2.elo).toBe(900)
    expect(player3.elo).toBe(822)
  })

  test('calculates elo for player 1 win with 100 players', () => {
    const match = new FreeForAll()

    for (let i = 1; i <= 100; i++) {
      match.addPlayer(new Player(i.toString(), 1000))
    }

    match.calculate(Array.from({ length: 100 }, (_, i) => (i + 1).toString()))

    expect(match.players.get('1')!.elo).toBe(1016)
    expect(match.players.get('50')!.elo).toBe(1000)
    expect(match.players.get('55')!.elo).toBe(998)
    expect(match.players.get('100')!.elo).toBe(984)
  })

  test('throws error if trying to calculate when min players for match has not been reached', () => {
    expect(() => {
      const player1 = new Player('1', 1000)
      const player2 = new Player('2', 900)
      const match = new FreeForAll({ minPlayers: 3 })

      match.addPlayer(player1)
      match.addPlayer(player2)
      match.calculate(['1', '2'])
    }).toThrow(ErrorType.MIN_PLAYERS)
  })

  test('throws error if calculation does not match player size in match', () => {
    expect(() => {
      const player1 = new Player('1', 1000)
      const player2 = new Player('2', 900)
      const match = new FreeForAll()

      match.addPlayer(player1)
      match.addPlayer(player2)
      match.calculate(['1'])
    }).toThrow(ErrorType.SIZE_MISMATCH)
  })
})
