import { Issue } from '@oats-ts/validators'

export type Failure = { issues: Issue[] }
export type Try<T> = T | Failure

export type ContentReader<R> = () => Promise<Try<R>>
export type Generator<R, G> = (data: R) => Promise<Try<G>>
export type Writer<G, W> = (data: G) => Promise<Try<W>>

export type GeneratorInput<R, G, W> = {
  reader: ContentReader<R>
  generator: Generator<R, G>
  writer: Writer<G, W>
}
