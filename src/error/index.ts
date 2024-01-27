export class BaseError<T extends string> extends Error {
  name: T
  message: string

  constructor(name: T, message: string) {
    super()
    this.name = name
    this.message = message
  }
}
