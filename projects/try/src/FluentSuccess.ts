import { Issue } from '@oats-ts/validators'
import { fluent } from './fluent'
import { Try, Success, Fluent, FluentTry } from './types'

export class FluentSuccess<T> implements Success<T>, Fluent<T> {
  public readonly data: T

  public constructor(data: T) {
    this.data = data
  }

  public get<S, F>(mapSuccess: (input: T) => S, _: (issues: Issue[]) => F): S {
    return mapSuccess(this.getData())
  }

  public isSuccess(): boolean {
    return true
  }

  public isFailure(): boolean {
    return false
  }

  public map<R>(transform: (input: T) => R): FluentSuccess<R> {
    return new FluentSuccess(transform(this.getData()))
  }

  public flatMap<R>(transform: (input: T) => Try<R>): FluentTry<R> {
    return fluent(transform(this.getData()))
  }

  public getData(): T {
    return this.data
  }

  public getDataOrElse(): T {
    return this.getData()
  }

  public getIssues(): never {
    throw new TypeError(`Can't call ${FluentSuccess.prototype.getIssues.name} on ${FluentSuccess.name}`)
  }

  public getIssuesOrElse(issues: Issue<string>[]): Issue<string>[] {
    return issues
  }

  public doIfSuccess(effect: (data: T) => void): FluentSuccess<T> {
    effect(this.getData())
    return this
  }

  public doIfFailure(): FluentSuccess<T> {
    return this
  }

  public getPlain(): Success<T> {
    return { data: this.getData() }
  }
}
