import { fromArray } from './fromArray'
import { Try } from './types'

export function zip<A>(a: Try<A>): Try<[A]>

export function zip<A, B>(a: Try<A>, b: Try<B>): Try<[A, B]>

export function zip<A, B, C>(a: Try<A>, b: Try<B>, c: Try<C>): Try<[A, B, C]>

export function zip<A, B, C, D>(a: Try<A>, b: Try<B>, c: Try<C>, d: Try<D>): Try<[A, B, C, D]>

export function zip<A, B, C, D, E>(a: Try<A>, b: Try<B>, c: Try<C>, d: Try<D>, e: Try<E>): Try<[A, B, C, D, E]>

export function zip<A, B, C, D, E, F>(
  a: Try<A>,
  b: Try<B>,
  c: Try<C>,
  d: Try<D>,
  e: Try<E>,
  f: Try<F>,
): Try<[A, B, C, D, E, F]>

export function zip<A, B, C, D, E, F, G>(
  a: Try<A>,
  b: Try<B>,
  c: Try<C>,
  d: Try<D>,
  e: Try<E>,
  f: Try<F>,
  g: Try<G>,
): Try<[A, B, C, D, E, F, G]>

export function zip<A, B, C, D, E, F, G, H>(
  a: Try<A>,
  b: Try<B>,
  c: Try<C>,
  d: Try<D>,
  e: Try<E>,
  f: Try<F>,
  g: Try<G>,
  h: Try<H>,
): Try<[A, B, C, D, E, F, G, H]>

export function zip<A, B, C, D, E, F, G, H, I>(
  a: Try<A>,
  b: Try<B>,
  c: Try<C>,
  d: Try<D>,
  e: Try<E>,
  f: Try<F>,
  g: Try<G>,
  h: Try<H>,
  i: Try<I>,
): Try<[A, B, C, D, E, F, G, H, I]>

export function zip<A, B, C, D, E, F, G, H, I, J>(
  a: Try<A>,
  b: Try<B>,
  c: Try<C>,
  d: Try<D>,
  e: Try<E>,
  f: Try<F>,
  g: Try<G>,
  h: Try<H>,
  i: Try<I>,
  j: Try<J>,
): Try<[A, B, C, D, E, F, G, H, I, J]>

export function zip(...input: Try<unknown>[]): Try<unknown[]> {
  return fromArray(input)
}
