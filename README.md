<div align="center">

![logo](https://github.com/user-attachments/assets/9128513a-ba8d-4da3-b4c1-63382081c14b)

![Build status](https://img.shields.io/github/actions/workflow/status/williamgrosset/teslo/ci.yml)
![NPM version](https://img.shields.io/npm/v/teslo?color=brightgreen)
![Downloads](https://img.shields.io/npm/dt/teslo)
![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
![Build size](https://img.shields.io/bundlejs/size/teslo?color=brightgreen)

A lightweight TypeScript library for calculating elo rating in multiplayer games.

</div>

## Quickstart

Install the `teslo` package.

```bash
npm install teslo
```

Create a `Duel` and calculate elo ratings.

```ts
import { Player, Duel } from 'teslo'

// Create a duel between 2 players
const match = new Duel([new Player('1', 1000), new Player('2', 900)])

// Calculate elo ratings for player 1 win
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

## Documentation

Visit [teslo.dev/docs](https://teslo.dev/docs).

## License

MIT
