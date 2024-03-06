import { TeamDuel } from '.'
import { Player } from '../../contestants/player'
import { Team } from '../../contestants/team'
import { ErrorType } from '../../../lib/match/error'

describe('TeamDuel', () => {
  let match: TeamDuel

  beforeEach(() => {
    const team1 = new Team('1')
    const team2 = new Team('2')

    team1.addPlayers(new Player('1', 1000), new Player('2', 900))
    team2.addPlayers(new Player('3', 800), new Player('4', 700))

    match = new TeamDuel()
    match.addTeams(team1, team2)
  })

  test('instantiates with empty constructor', () => {
    expect(match).toBeDefined()
  })

  test('factory method instantiates with teams', () => {
    const match = TeamDuel.create(
      {},
      Team.create('1', Player.create('1', 1000), Player.create('2', 900)),
      Team.create('2', Player.create('3', 800), Player.create('4', 700))
    )
    expect(match).toBeDefined()
    expect(match).toBeInstanceOf(TeamDuel)
    expect(match.contestants.size).toBe(2)
  })

  test('adds teams to match', () => {
    expect(match.contestants.size).toBe(2)
  })

  test('throws error when adding more than 2 teams to match', () => {
    expect(() => {
      const team = new Team('3')
      match.addTeam(team)
    }).toThrow(ErrorType.MAX_TEAMS)
  })

  test('calculates elo for team 1 winning', () => {
    const results = match.calculate('1')
    expect(results).toStrictEqual([
      {
        id: '1',
        players: [
          {
            id: '1',
            elo: 1006
          },
          {
            id: '2',
            elo: 909
          }
        ]
      },
      {
        id: '2',
        players: [
          {
            id: '3',
            elo: 791
          },
          {
            id: '4',
            elo: 694
          }
        ]
      }
    ])
  })

  test('calculates elo for team 2 winning', () => {
    const results = match.calculate('2')
    expect(results).toStrictEqual([
      {
        id: '1',
        players: [
          {
            id: '1',
            elo: 974
          },
          {
            id: '2',
            elo: 877
          }
        ]
      },
      {
        id: '2',
        players: [
          {
            id: '3',
            elo: 823
          },
          {
            id: '4',
            elo: 726
          }
        ]
      }
    ])
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
