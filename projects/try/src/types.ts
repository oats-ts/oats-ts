import { Issue } from '@oats-ts/validators'
import { FluentFailure } from './FluentFailure'
import { FluentSuccess } from './FluentSuccess'
import { FAILURE_SYMBOL, SUCCESS_SYMBOL } from './symbols'

export type Success<T> = {
  [SUCCESS_SYMBOL]: true
  readonly data: T
}

export type Failure = {
  [FAILURE_SYMBOL]: true
  readonly issues: Issue[]
}

export type Try<T> = Success<T> | Failure

export type Fluent<T> = {
  map<R>(transform: (input: T) => R): FluentTry<R>
  flatMap<R>(transform: (input: T) => Try<R>): FluentTry<R>
  toTry(): Try<T>
}

export type FluentTry<T> = FluentSuccess<T> | FluentFailure
