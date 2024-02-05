import { Team } from '.'
import { Player } from '../player'

describe('Team', () => {
  let team: Team

  beforeEach(() => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)

    team = new Team('1')

    team.addPlayer(player1)
    team.addPlayer(player2)
  })

  test('adds players to team', () => {
    expect(team.players.size).toBe(2)
  })

  test('gets average elo of team', () => {
    const elo = team.getAverageElo()
    expect(elo).toBe(950)
  })
})
