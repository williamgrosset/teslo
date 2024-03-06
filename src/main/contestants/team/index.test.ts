import { Team } from '.'
import { Player } from '../player'

describe('Team', () => {
  test('adds players to team', () => {
    const team = new Team('1')
    team.addPlayers(new Player('1', 1000), new Player('2', 900))
    expect(team.players.size).toBe(2)
  })

  test('gets average elo of team', () => {
    const team = new Team('1')
    team.addPlayers(new Player('1', 1000), new Player('2', 900))
    const elo = team.getAverageElo()
    expect(elo).toBe(950)
  })
})
