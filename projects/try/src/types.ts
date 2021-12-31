import { Issue } from '@oats-ts/validators'
import { FluentFailure } from './FluentFailure'
import { FluentSuccess } from './FluentSuccess'

export type Success<T> = { readonly data: T }

export type Failure = { readonly issues: Issue[] }

export type Try<T> = Success<T> | Failure

export type Fluent<T> = {
  map<R>(transform: (input: T) => R): FluentTry<R>
  flatMap<R>(transform: (input: T) => Try<R>): FluentTry<R>
  doIfSuccess(effect: (data: T) => void): FluentTry<T>
  doIfFailure(effect: (issues: Issue[]) => void): FluentTry<T>
  isSuccess(): boolean
  isFailure(): boolean
  get<S, F>(mapSuccess: (input: T) => S, mapFailure: (input: Issue[]) => F): S | F
  getData(): T
  getDataOrElse(data: T): T
  getIssues(): Issue[]
  getIssuesOrElse(issues: Issue[]): Issue[]
  getPlain(): Try<T>
}

export type FluentTry<T> = FluentSuccess<T> | FluentFailure
