import { BaseError } from '../../error'

const ERROR_NAME = 'MATCH_ERROR'

export const ErrorType = {
  MATCH_COMPLETE: 'Match completed',
  MATCH_INCOMPLETE: 'Match incomplete',
  MAX_PLAYERS: 'Cannot add more players',
  MIN_PLAYERS: 'Need more players',
  MAX_TEAMS: 'Cannot add more teams',
  MIN_TEAMS: 'Need more teams',
  SIZE_MISMATCH: 'Calculation does not match contestant size in match',
  PLAYER_NOT_FOUND: 'Player not found',
  TEAM_NOT_FOUND: 'Team not found',
  MISSING_OPPONENT_ELO: 'Could not find opponent elo'
}

type ErrorTypeKey = keyof typeof ErrorType

export class MatchError<T extends ErrorTypeKey> extends BaseError<typeof ERROR_NAME> {
  constructor(message: (typeof ErrorType)[T]) {
    super(ERROR_NAME, message)
  }
}
