# teslo

![Build status](https://img.shields.io/github/actions/workflow/status/williamgrosset/teslo/test.yml)
![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
![Downloads](https://img.shields.io/npm/dt/teslo)
![Build size](https://img.shields.io/bundlephobia/minzip/teslo)

`teslo` is a TypeScript package for calculating elo rating in multiplayer games.

> Supports duels, free-for-alls, and team matches. Compatible with both browser and Node.js environments.

### Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [Duel](#duel)
  - [Free-For-All](#free-for-all)
  - [Team Duel](#team-duel)
  - [Team Free-For-All](#team-free-for-all)
- [API](#api)
  - [`Player`](#player)
  - [`Team`](#team)
  - [`Duel`](#duel-1)
  - [`FreeForAll`](#freeforall)
  - [`TeamDuel`](#teamduel)
  - [`TeamFreeForAll`](#teamfreeforall)
- [Elo Calculation](#elo-calculation)
- [Development](#development)
- [License](#license)

## Install

Install the `teslo` package.

```sh
# npm
npm install teslo

# yarn
yarn add teslo

# pnpm
pnpm add teslo
```

## Usage

### Duel

```ts
import { Player, Duel } from 'teslo'

const match = new Duel()

match.addPlayers(new Player('1', 1000), new Player('2', 900))

const results = match.calculate('1')

/*
  [
    {
      id: '1',
      elo: 1012
    },
    {
      id: '2',
      elo: 888
    }
  ]
*/
```

### Free-For-All

```ts
import { Player, FreeForAll } from 'teslo'

const match = new FreeForAll()

match.addPlayers(
  new Player('1', 1000),
  new Player('2', 900),
  new Player('3', 800)
)

const results = match.calculate('1', '2', '3')

/*
  [
    {
      id: '1',
      elo: 1010
    },
    {
      id: '2',
      elo: 900
    },
    {
      id: '3',
      elo: 790
    }
  ]
*/
```

### Team Duel

```ts
import { Player, Team, TeamDuel } from 'teslo'

const match = new TeamDuel()
const team1 = new Team('1')
const team2 = new Team('2')

team1.addPlayers(new Player('1', 1000), new Player('2', 900))
team2.addPlayers(new Player('3', 800), new Player('4', 700))
match.addTeams(team1, team2)

const results = match.calculate('1')

/*
  [
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
  ]
*/
```

### Team Free-For-All

```ts
import { Player, Team, TeamFreeForAll } from 'teslo'

const match = new TeamFreeForAll()
const team1 = new Team('1')
const team2 = new Team('2')
const team3 = new Team('3')

team1.addPlayers(new Player('1', 1000), new Player('2', 900))
team2.addPlayers(new Player('3', 800), new Player('4', 700))
team3.addPlayers(new Player('5', 600), new Player('6', 500))
match.addTeams(team1, team2, team3)

const results = match.calculate('1', '2', '3')

/*
  [
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
  ]
*/
```

## API

### `Player`

#### Constructor

```ts
new Player(id: string, elo: number)
```

#### Methods

```ts
static create(id: string, elo: number): Player
getExpectedResult(opponentElo: number): number
calculate(opponentElo: number, won: boolean, kFactor: number): number
```

### `Team`

#### Constructor

```ts
new Team(id: string)
```

#### Methods

```ts
static create(id: string, ...players: Player[]): Team
addPlayer(player: Player): this
addPlayers(...players: Player[]): this
getAverageElo(): number
```

### `Duel`

#### Constructor

```ts
interface Options {
  kFactor?: number
}

new Duel(options?: Options)
```

#### Methods

```ts
static create(options?: Options, ...players: Player[]): Duel
addPlayer(player: Player): this
addPlayers(...players: Player[]): this
calculate(playerId: string): PlayerResult[]
getResults(): PlayerResult[]
```

#### Description

A duel is between 2 players. `playerId` determines the winner.

### `FreeForAll`

#### Constructor

```ts
interface Options {
  kFactor?: number
  minPlayers?: number
  maxPlayers?: number
}

new FreeForAll(options?: Options)
```

#### Methods

```ts
static create(options?: Options, ...players: Player[]): FreeForAll
addPlayer(player: Player): this
addPlayers(...players: Player[]): this
calculate(...playerIds: string[]): PlayerResult[]
getResults(): PlayerResult[]
```

#### Description

A free-for-all is between `minPlayers` and `maxPlayers`. `playerIds` determines the winning order.

### `TeamDuel`

#### Constructor

```ts
interface Options {
  kFactor?: number
}

new TeamDuel(options?: Options)
```

#### Methods

```ts
static create(options?: Options, ...teams: Team[]): TeamDuel
addTeam(team: Team): this
addTeams(...teams: Team[]): this
calculate(teamId: string): TeamResult[]
getResults(): TeamResult[]
```

#### Description

A team duel is between 2 teams. `teamId` determines the winner.

### `TeamFreeForAll`

#### Constructor

```ts
interface Options {
  kFactor?: number
  minTeams?: number
  maxTeams?: number
}

new TeamFreeForAll(options?: Options)
```

#### Methods

```ts
static create(options?: Options, ...teams: Team[]): TeamFreeForAll
addTeam(team: Team): this
addTeams(...teams: Team[]): this
calculate(...teamIds: string[]): TeamResult[]
getResults(): TeamResult[]
```

#### Description

A team free-for-all is between `minTeams` and `maxTeams`. `teamIds` determines the winning order.

## Elo Calculation

Elo calculation starts with a player to player comparison. Initially, we calculate the probability of a player winning against their opponent.

```ts
Expected Result = 1 / (1 + 10 ^ ((Opponent Elo - Player Elo) / 400))
```

Once we have the expected result of a player against their opponent, we calculate their new elo with the actual result. `Result` is either a `1` or `0` based on the player winning or losing respectively.

```ts
New Elo = Current Elo + KFactor * (Result - Expected Result)
```

In a duel, each player either gains or loses elo based on winning or losing. In a free-for-all, elo is calculated by player placement; players lose elo to those who placed higher and gain elo from those who placed lower. In a team match, each player's elo is calculated based on the average elo of the opposing team(s).

You can learn more about the elo rating system via the [Wiki](https://en.wikipedia.org/wiki/Elo_rating_system).

## Development

### Local

```
pnpm install
pnpm build
```

### Tests

```
pnpm test
```

## License

MIT
