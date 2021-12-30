import { fluent } from './fluent'
import { Try, Success, FluentTryInterface } from './types'

export class FluentSuccess<T> implements Success<T>, FluentTryInterface<T> {
  public readonly data: T

  constructor(data: T) {
    this.data = data
  }

  isSuccess(): boolean {
    return true
  }

  isFailure(): boolean {
    return false
  }

  map<R>(transform: (input: T) => R): FluentTryInterface<R> {
    return new FluentSuccess(transform(this.getData()))
  }

  flatMap<R>(transform: (input: T) => Try<R>): FluentTryInterface<R> {
    return fluent(transform(this.getData()))
  }

  getData(): T {
    return this.data
  }

  getIssues(): never {
    throw new TypeError(`Can't call ${FluentSuccess.prototype.getIssues.name} on ${FluentSuccess.name}`)
  }

  getPlain(): Try<T> {
    return { data: this.getData() }
  }
}
