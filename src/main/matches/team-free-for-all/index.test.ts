import { TeamFreeForAll } from '.'
import { Player } from '../../contestants/player'
import { Team } from '../../contestants/team'
import { ErrorType } from '../../../lib/match/error'

describe('TeamFreeForAll', () => {
  let match: TeamFreeForAll

  beforeEach(() => {
    const player1 = new Player('1', 1000)
    const player2 = new Player('2', 900)
    const player3 = new Player('3', 800)
    const player4 = new Player('4', 700)
    const player5 = new Player('5', 600)
    const player6 = new Player('6', 500)
    const team1 = new Team('1')
    const team2 = new Team('2')
    const team3 = new Team('3')

    team1.addPlayer(player1)
    team1.addPlayer(player2)
    team2.addPlayer(player3)
    team2.addPlayer(player4)
    team3.addPlayer(player5)
    team3.addPlayer(player6)

    match = new TeamFreeForAll()

    match.addTeam(team1)
    match.addTeam(team2)
    match.addTeam(team3)
  })

  test('adds teams to match', () => {
    expect(match.contestants.size).toBe(3)
  })

  test('calculates elo for team 1 winning', () => {
    const results = match.calculate(['1', '2', '3'])
    expect(results).toStrictEqual([
      {
        id: '1',
        players: [
          {
            id: '1',
            elo: 1004
          },
          {
            id: '2',
            elo: 906
          }
        ]
      },
      {
        id: '2',
        players: [
          {
            id: '3',
            elo: 798
          },
          {
            id: '4',
            elo: 701
          }
        ]
      },
      {
        id: '3',
        players: [
          {
            id: '5',
            elo: 593
          },
          {
            id: '6',
            elo: 496
          }
        ]
      }
    ])
  })

  test('calculates elo for team 2 winning', () => {
    const results = match.calculate(['2', '1', '3'])
    expect(results).toStrictEqual([
      {
        id: '1',
        players: [
          {
            id: '1',
            elo: 988
          },
          {
            id: '2',
            elo: 890
          }
        ]
      },
      {
        id: '2',
        players: [
          {
            id: '3',
            elo: 814
          },
          {
            id: '4',
            elo: 717
          }
        ]
      },
      {
        id: '3',
        players: [
          {
            id: '5',
            elo: 593
          },
          {
            id: '6',
            elo: 496
          }
        ]
      }
    ])
  })

  test('calculates elo for team 3 winning', () => {
    const results = match.calculate(['3', '2', '1'])
    expect(results).toStrictEqual([
      {
        id: '1',
        players: [
          {
            id: '1',
            elo: 972
          },
          {
            id: '2',
            elo: 874
          }
        ]
      },
      {
        id: '2',
        players: [
          {
            id: '3',
            elo: 798
          },
          {
            id: '4',
            elo: 701
          }
        ]
      },
      {
        id: '3',
        players: [
          {
            id: '5',
            elo: 625
          },
          {
            id: '6',
            elo: 528
          }
        ]
      }
    ])
  })

  test('throws error if calculating without min teams', () => {
    expect(() => {
      const team1 = new Team('1')
      const team2 = new Team('2')
      const match = new TeamFreeForAll({ minTeams: 3 })

      team1.addPlayer(new Player('1', 1000))
      team2.addPlayer(new Player('2', 900))

      match.addTeam(team1)
      match.addTeam(team2)
      match.calculate(['1', '2'])
    }).toThrow(ErrorType.MIN_TEAMS)
  })

  test('throws error if calculation does not match team size in match', () => {
    expect(() => {
      const team1 = new Team('1')
      const team2 = new Team('2')
      const match = new TeamFreeForAll()

      team1.addPlayer(new Player('1', 1000))
      team2.addPlayer(new Player('2', 900))

      match.addTeam(team1)
      match.addTeam(team2)
      match.calculate(['1'])
    }).toThrow(ErrorType.SIZE_MISMATCH)
  })
})