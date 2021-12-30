import { Issue } from '@oats-ts/validators'
import { FluentFailure } from './FluentFailure'
import { FluentSuccess } from './FluentSuccess'

export type Success<T> = { readonly data: T }

export type Failure = { readonly issues: Issue[] }

export type Try<T> = Success<T> | Failure

export type FluentTryInterface<T> = {
  isSuccess(): boolean
  isFailure(): boolean
  map<R>(transform: (input: T) => R): FluentTryInterface<R>
  flatMap<R>(transform: (input: T) => Try<R>): FluentTryInterface<R>
  getData(): T
  getIssues(): Issue[]
  getPlain(): Try<T>
}

export type FluentTry<T> = FluentSuccess<T> | FluentFailure
