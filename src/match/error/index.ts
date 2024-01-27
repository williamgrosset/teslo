import { BaseError } from '../../error'

const ERROR_NAME = 'MATCH_ERROR'

export const ErrorType = {
  MATCH_COMPLETE: 'Match is completed',
  MAX_SIZE: 'Cannot add more than 2 players to a duel',
  MISSING_OPPONENT_ELO: 'Could not find opponent elo'
} as const

type ErrorTypeKey = keyof typeof ErrorType

export class MatchError<T extends ErrorTypeKey> extends BaseError<
  typeof ERROR_NAME
> {
  constructor(message: (typeof ErrorType)[T]) {
    super(ERROR_NAME, message)
  }
}
