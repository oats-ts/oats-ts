import { Issue } from '@oats-ts/validators'
import { fluent } from './fluent'
import { Try, Success, FluentTryInterface, FluentTry } from './types'

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

  map<R>(transform: (input: T) => R): FluentSuccess<R> {
    return new FluentSuccess(transform(this.getData()))
  }

  flatMap<R>(transform: (input: T) => Try<R>): FluentTry<R> {
    return fluent(transform(this.getData()))
  }

  getData(): T {
    return this.data
  }

  getDataOrElse(): T {
    return this.data
  }

  getIssues(): never {
    throw new TypeError(`Can't call ${FluentSuccess.prototype.getIssues.name} on ${FluentSuccess.name}`)
  }

  getIssuesOrElse(issues: Issue<string>[]): Issue<string>[] {
    return issues
  }

  doIfSuccess(effect: (data: T) => void): FluentSuccess<T> {
    effect(this.getData())
    return this
  }

  doIfFailure(): FluentSuccess<T> {
    return this
  }

  getPlain(): Success<T> {
    return { data: this.getData() }
  }
}
