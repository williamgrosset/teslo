import { TeamDuel } from '.'
import { Player } from '../player'
import { Team } from '../team'
import { ErrorType } from '../../lib/match/error'

describe('TeamDuel', () => {
  let match: TeamDuel

  beforeEach(() => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const player3 = new Player('3', 800)
    const player4 = new Player('4', 700)
    const team1 = new Team('1')
    const team2 = new Team('2')

    team1.addPlayer(player1)
    team1.addPlayer(player2)
    team2.addPlayer(player3)
    team2.addPlayer(player4)

    match = new TeamDuel()

    match.addTeam(team1)
    match.addTeam(team2)
  })

  test('adds teams to match', () => {
    expect(match.teams.size).toBe(2)
  })

  test('throws error when adding more than 2 teams to match', () => {
    expect(() => {
      const team = new Team('3')
      match.addTeam(team)
    }).toThrow(ErrorType.MAX_TEAMS)
  })

  test('calculates elo for team 1 winning', () => {
    match.calculate('1')
    expect(match.teams.get('1')!.players.get('1')!.elo).toBe(1006)
    expect(match.teams.get('1')!.players.get('2')!.elo).toBe(909)
    expect(match.teams.get('2')!.players.get('3')!.elo).toBe(791)
    expect(match.teams.get('2')!.players.get('4')!.elo).toBe(694)
  })

  test('calculates elo for team 2 winning', () => {
    match.calculate('2')
    expect(match.teams.get('1')!.players.get('1')!.elo).toBe(974)
    expect(match.teams.get('1')!.players.get('2')!.elo).toBe(877)
    expect(match.teams.get('2')!.players.get('3')!.elo).toBe(823)
    expect(match.teams.get('2')!.players.get('4')!.elo).toBe(726)
  })

  test('throws error when calculating without 2 teams', () => {
    expect(() => {
      match = new TeamDuel()
      const team = new Team('1')

      match.addTeam(team)
      match.calculate('1')
    }).toThrow(ErrorType.MIN_TEAMS)
  })
})
