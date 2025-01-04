import { Player } from '../player'

export class Team {
  id: string
  players: Map<string, Player>

  constructor(id: string, players?: Player[]) {
    this.id = id
    this.players = new Map()

    if (players) {
      this.addPlayers(...players)
    }
  }

  static create(id: string, players?: Player[]): Team {
    return new Team(id, players)
  }

  addPlayer(player: Player): this {
    this.players.set(player.id, player)
    return this
  }

  addPlayers(...players: Player[]): this {
    players.forEach((player) => this.addPlayer(player))
    return this
  }

  getAverageElo(): number {
    if (this.players.size === 0) {
      return 0
    }

    let elo = 0

    for (const player of this.players.values()) {
      elo += player.elo
    }

    return elo / this.players.size
  }
}
