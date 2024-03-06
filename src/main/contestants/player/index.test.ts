import { Player } from '.'

describe('Player', () => {
  test('instantiates with id and elo', () => {
    const player = new Player('1', 1000)
    expect(player).toBeDefined()
    expect(player.id).toBe('1')
    expect(player.elo).toBe(1000)
  })

  test('factory method instantiates with id and elo', () => {
    const player = Player.create('1', 1000)
    expect(player).toBeDefined()
    expect(player).toBeInstanceOf(Player)
    expect(player.id).toBe('1')
    expect(player.elo).toBe(1000)
  })

  test('calculates probability of winning against opponent', () => {
    const player = new Player('1', 1000)
    const expectedResult = player.getExpectedResult(900)
    expect(Math.round(expectedResult * 1e2) / 1e2).toBe(0.64)
  })

  test('calculates elo of winning against opponent', () => {
    const player = new Player('1', 1000)
    const elo = player.calculate(900, true, 32)
    expect(elo).toBe(1012)
  })

  test('calculates elo of losing against opponent', () => {
    const player = new Player('1', 1000)
    const elo = player.calculate(900, false, 32)
    expect(elo).toBe(980)
  })
})
