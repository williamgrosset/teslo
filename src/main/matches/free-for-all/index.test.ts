import { FreeForAll } from '.'
import { Player } from '../../contestants/player'
import { ErrorType } from '../../../lib/match/error'

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

    const results = match.calculate(['1', '2'])

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

  test('calculates elo for player 2 win with 2 players', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const match = new FreeForAll()

    match.addPlayer(player1)
    match.addPlayer(player2)

    const results = match.calculate(['2', '1'])

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

  test('calculates elo for player 1 win with 3 players', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const player3 = new Player('3', 800)
    const match = new FreeForAll()

    match.addPlayer(player1)
    match.addPlayer(player2)
    match.addPlayer(player3)

    const results = match.calculate(['1', '2', '3'])

    expect(results).toStrictEqual([
      {
        id: '1',
        elo: 1010
      },
      {
        id: '2',
        elo: 900
      },
      {
        id: '3',
        elo: 790
      }
    ])
  })

  test('calculates elo for player 2 win with 3 players', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const player3 = new Player('3', 800)
    const match = new FreeForAll()

    match.addPlayer(player1)
    match.addPlayer(player2)
    match.addPlayer(player3)

    const results = match.calculate(['2', '3', '1'])

    expect(results).toStrictEqual([
      {
        id: '1',
        elo: 978
      },
      {
        id: '2',
        elo: 916
      },
      {
        id: '3',
        elo: 806
      }
    ])
  })

  test('calculates elo for player 3 win with 3 players', () => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const player3 = new Player('3', 800)
    const match = new FreeForAll()

    match.addPlayer(player1)
    match.addPlayer(player2)
    match.addPlayer(player3)

    const results = match.calculate(['3', '2', '1'])

    expect(results).toStrictEqual([
      {
        id: '1',
        elo: 978
      },
      {
        id: '2',
        elo: 900
      },
      {
        id: '3',
        elo: 822
      }
    ])
  })

  test('calculates elo for player 1 win with 100 players', () => {
    const match = new FreeForAll()

    for (let i = 1; i <= 100; i++) {
      match.addPlayer(new Player(i.toString(), 1000))
    }

    const results = match.calculate(
      Array.from({ length: 100 }, (_, i) => (i + 1).toString())
    )

    expect((results[0] as Player).elo).toBe(1016)
    expect((results[9] as Player).elo).toBe(1013)
    expect((results[49] as Player).elo).toBe(1000)
    expect((results[54] as Player).elo).toBe(998)
    expect((results[99] as Player).elo).toBe(984)
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
