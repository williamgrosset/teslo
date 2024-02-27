import { Team } from '.'
import { Player } from '../player'

describe('Team', () => {
  let team: Team

  beforeEach(() => {
    team = new Team('1')
    team.addPlayer(new Player('1', 1000))
    team.addPlayer(new Player('2', 900))
  })

  test('adds players to team', () => {
    expect(team.players.size).toBe(2)
  })

  test('gets average elo of team', () => {
    const elo = team.getAverageElo()
    expect(elo).toBe(950)
  })
})
