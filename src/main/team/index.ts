import { Player } from '../player'

export class Team {
  id: string
  players: Map<string, Player>

  constructor(id: string) {
    this.id = id
    this.players = new Map()
  }

  addPlayer(player: Player) {
    this.players.set(player.id, player)
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
