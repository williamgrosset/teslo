import { BaseError } from '../../error'

const ERROR_NAME = 'MATCH_ERROR'

export const ErrorType = {
  MATCH_COMPLETE: 'Match completed',
  MAX_PLAYERS: 'Cannot add more players',
  MIN_PLAYERS: 'Need more players',
  SIZE_MISMATCH: 'Calculation does not match player size in match',
  PLAYER_NOT_FOUND: 'Player not found',
  MISSING_OPPONENT_ELO: 'Could not find opponent elo'
}

type ErrorTypeKey = keyof typeof ErrorType

export class MatchError<T extends ErrorTypeKey> extends BaseError<
  typeof ERROR_NAME
> {
  constructor(message: (typeof ErrorType)[T]) {
    super(ERROR_NAME, message)
  }
}
