import { Issue } from '@oats-ts/validators'
import { FluentFailure } from './FluentFailure'
import { FluentSuccess } from './FluentSuccess'
import { FAILURE_SYMBOL, SUCCESS_SYMBOL } from './symbols'

export type Success<T> = { readonly data: T; [SUCCESS_SYMBOL]: true }

export type Failure = { readonly issues: Issue[]; [FAILURE_SYMBOL]: true }

export type Try<T> = Success<T> | Failure

export type Fluent<T> = {
  map<R>(transform: (input: T) => R): FluentTry<R>
  flatMap<R>(transform: (input: T) => Try<R>): FluentTry<R>
  get<S, F>(mapSuccess: (input: T) => S, mapFailure: (input: Issue[]) => F): S | F
  toTry(): Try<T>
}

export type FluentTry<T> = FluentSuccess<T> | FluentFailure
