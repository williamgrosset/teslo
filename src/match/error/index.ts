import { BaseError } from '../../error'

const ERROR_NAME = 'MATCH_ERROR'

export const ErrorType = {
  MATCH_COMPLETE: 'Match is completed',
  MAX_PLAYERS: 'Cannot add more players',
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
