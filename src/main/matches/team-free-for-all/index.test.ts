import { TeamFreeForAll } from '.'
import { Player } from '../../contestants/player'
import { Team } from '../../contestants/team'
import { ErrorType } from '../../../lib/match/error'

describe('TeamFreeForAll', () => {
  let match: TeamFreeForAll

  beforeEach(() => {
    match = new TeamFreeForAll([
      new Team('1', [new Player('1', 1000), new Player('2', 900)]),
      new Team('2', [new Player('3', 800), new Player('4', 700)]),
      new Team('3', [new Player('5', 600), new Player('6', 500)])
    ])
  })

  test('instantiates with empty constructor', () => {
    expect(match).toBeDefined()
  })

  test('factory method instantiates with teams', () => {
    const match = TeamFreeForAll.create([
      Team.create('1', [Player.create('1', 1000), Player.create('2', 900)]),
      Team.create('2', [Player.create('3', 800), Player.create('4', 700)]),
      Team.create('3', [Player.create('5', 600), Player.create('4', 500)])
    ])
    expect(match).toBeDefined()
    expect(match).toBeInstanceOf(TeamFreeForAll)
    expect(match.size).toBe(3)
  })

  test('adds teams to match', () => {
    expect(match.size).toBe(3)
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
      new TeamFreeForAll(
        [new Team('1', [new Player('1', 1000)]), new Team('2', [new Player('2', 900)])],
        { minTeams: 3 }
      ).calculate(['1', '2'])
    }).toThrow(ErrorType.MIN_TEAMS)
  })

  test('throws error if calculation does not match team size in match', () => {
    expect(() => {
      new TeamFreeForAll([
        new Team('1', [new Player('1', 1000)]),
        new Team('2', [new Player('2', 900)])
      ]).calculate(['1'])
    }).toThrow(ErrorType.SIZE_MISMATCH)
  })
})
