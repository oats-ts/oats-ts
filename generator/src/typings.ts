import { Issue } from '@oats-ts/validators'

export type Failure = { issues: Issue[] }
export type Try<T> = T | Failure

export type ContentReader<R> = () => Promise<Try<R>>
export type GeneratorFn<R, G extends Module> = (data: R) => Promise<Try<G[]>>
export type Writer<G, W> = (data: G[]) => Promise<Try<W>>

export type Module<C = any, D = any> = {
  path: string
  content: C
  dependencies: D
}

export type Generator<R, G extends Module> = {
  id: string
  produces: string[]
  consumes: string[]
  generate: GeneratorFn<R, G>
}

export type GeneratorInput<R, G extends Module, W> = {
  reader: ContentReader<R>
  generators: Generator<R, G>[]
  writer: Writer<G, W>
}
