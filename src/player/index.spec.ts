import { Player } from '.'

describe('Player', () => {
  test('instantiates with id and elo', () => {
    const player = new Player('1', 1000)
    expect(player.id).toBe('1')
    expect(player.elo).toBe(1000)
  })

  test('calculates probability of winning against opponent', () => {
    const player = new Player('1', 1000)
    const expectedResult = player.getExpectedResult(900)
    expect(Math.round(expectedResult * 1e2) / 1e2).toBe(0.64)
  })
})
