import { fluent } from './fluent'
import { success } from './success'
import { SUCCESS_SYMBOL } from './symbols'
import { Try, Success, Fluent, FluentTry } from './types'

export class FluentSuccess<T> implements Success<T>, Fluent<T> {
  public readonly data: T
  public [SUCCESS_SYMBOL]: true = true

  public constructor(data: T) {
    this.data = data
  }

  public map<R>(transform: (input: T) => R): FluentSuccess<R> {
    return new FluentSuccess(transform(this.data))
  }

  public flatMap<R>(transform: (input: T) => Try<R>): FluentTry<R> {
    return fluent(transform(this.data))
  }

  public toTry(): Success<T> {
    return success(this.data)
  }
}
