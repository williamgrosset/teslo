export interface Options {
  kFactor?: number
  minContestants?: number
  maxContestants?: number
}

// Elo calculation
export const DEFAULT_K_FACTOR = 32

// Min/max contestants
export const DUEL_SIZE = 2
export const DEFAULT_MIN_CONTESTANTS = 2
export const DEFAULT_MAX_CONTESTANTS = 256
