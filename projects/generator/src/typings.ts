import { Issue } from '@oats-ts/validators'

export type Failure = { issues: Issue[] }
export type Try<T> = T | Failure

export type ContentReader<R> = () => Promise<Try<R>>
export type Writer<G> = (data: G[]) => Promise<Try<G[]>>

export type Module<C = any, D = any> = {
  path: string
  content: C[]
  dependencies: D[]
}

export type CodeGenerator<R, G extends Module<C, D>, C = any, D = any> = {
  id: string
  produces: string[]
  consumes: string[]
  initialize: (data: R, generators: CodeGenerator<R, G>[]) => void
  generate: () => Promise<Try<G[]>>
  reference?: (input: any, target: string) => C
}

export type GeneratorInput<R, G extends Module> = {
  reader: ContentReader<R>
  generators: CodeGenerator<R, G>[]
  writer: Writer<G>
  log?: boolean
}
