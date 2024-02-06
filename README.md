# teslo

![Build status](https://img.shields.io/github/actions/workflow/status/williamgrosset/teslo/test.yml)

Elo rating calculator compatible with both Node.js and browser environments.

> Calculate elo rating in multiplayer games. Supports duels, free-for-alls, and team matches.

### Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [Duel](#duel)
  - [Free-For-All](#free-for-all)
  - [Team Duel](#team-duel)
- [API](#api)
  - [`Player`](#player)
  - [`Team`](#team)
  - [`Duel`](#duel-1)
  - [`FreeForAll`](#freeforall)
  - [`TeamDuel`](#teamduel)
- [Elo Calculation](#elo-calculation)
- [Development](#development)

## Install

Install the `teslo` package:

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

match.addPlayer(new Player('1', 1000))
match.addPlayer(new Player('2', 900))

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

match.addPlayer(new Player('1', 1000))
match.addPlayer(new Player('2', 900))
match.addPlayer(new Player('3', 800))

const results = match.calculate(['1', '2', '3'])

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

team1.addPlayer(new Player('1', 1000))
team1.addPlayer(new Player('2', 900))
team2.addPlayer(new Player('3', 800))
team2.addPlayer(new Player('4', 700))
match.addTeam(team1)
match.addTeam(team2)

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

## API

### `Player`

#### Constructor

```ts
Player(id: number, elo: number)
```

### `Team`

#### Constructor

```ts
Team(id: number)
```

#### Methods

```ts
addPlayer(player: Player)
```

### `Duel`

#### Constructor

```ts
interface Options {
  kFactor?: number
}

Duel(options?: Options)
```

#### Methods

```ts
addPlayer(player: Player)
calculate(playerId: string): Results
```

#### Description

A duel is between 2 players. `playerId` decides the winner.

### `FreeForAll`

#### Constructor

```ts
interface Options {
  kFactor?: number
  minPlayers?: number
  maxPlayers?: number
}

FreeForAll(options?: Options)
```

#### Methods

```ts
addPlayer(player: Player)
calculate(playerIds: string[]): Results
```

#### Description

A free for all match is between 2 or more players. `playerIds` decides the ordering of winners.

### `TeamDuel`

#### Constructor

```ts
interface Options {
  kFactor?: number
}

TeamDuel(options?: Options)
```

#### Methods

```ts
addTeam(team: Team)
calculate(teamId: string): Results
```

#### Description

A team duel is between 2 teams. `teamId` decides the winner.

## Elo Calculation

Elo calculation starts with a player to player comparison. Initially, we calculate the probability of a player winning against their opponent.

```ts
Expected Result = 1 / (1 + 10 ^ ((Opponent Elo - Player Elo) / 400))
```

Once we have the expected result of a player against their opponent, we can calculate their new elo with the actual result. `Result` is either a `1` or `0` based on the player winning or losing respectively.

```ts
New Elo = Old Elo + KFactor * (Result - Expected Result)
```

In **duels**, elo calculation is straightforward as one player wins and the other loses. In team matches, each player's elo is calculated based on the average elo of the opposing team.

In **free-for-alls**, elo is calculated by player placement. Players lose elo to those who placed higher and gain elo from those who placed lower.

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
