import { Player } from '../player'

export class Team {
  id: string
  players: Map<string, Player>

  constructor(id: string) {
    this.id = id
    this.players = new Map()
  }

  static create(id: string, ...players: Player[]): Team {
    const team = new Team(id)
    team.addPlayers(...players)
    return team
  }

  addPlayer(player: Player): this {
    this.players.set(player.id, player)
    return this
  }

  addPlayers(...players: Player[]): this {
    players.forEach(player => this.addPlayer(player))
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
