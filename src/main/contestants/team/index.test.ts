import { Team } from '.'
import { Player } from '../player'

describe('Team', () => {
  test('instantiates with id', () => {
    const team = new Team('1')
    expect(team).toBeDefined()
    expect(team.id).toBe('1')
  })

  test('factory method instantiates with id and players', () => {
    const team = Team.create('1', [Player.create('1', 1000)])
    expect(team).toBeDefined()
    expect(team).toBeInstanceOf(Team)
    expect(team.id).toBe('1')
    expect(team.players.size).toBe(1)
  })

  test('adds players to team', () => {
    const team = new Team(
      '1',
      [new Player('1', 1000), new Player('2', 900)]
    )
    expect(team.players.size).toBe(2)
  })

  test('gets average elo of team', () => {
    const team = new Team(
      '1',
      [new Player('1', 1000), new Player('2', 900)]
    )
    const elo = team.getAverageElo()
    expect(elo).toBe(950)
  })
})
