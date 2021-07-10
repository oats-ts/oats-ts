import { Issue } from '@oats-ts/validators'

export type Result<T> = {
  issues: Issue[]
  isOk: boolean
  data?: T
}

export type ContentReader<R> = () => Promise<Result<R>>
export type Writer<G> = (data: G[]) => Promise<Result<G[]>>

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
  generate: () => Promise<Result<G[]>>
  reference?: (input: any, target: string) => C
  dependencies?: (fromPath: string, input: any, target: string) => D[]
}

export type GeneratorInput<R, G extends Module> = {
  reader: ContentReader<R>
  generators: CodeGenerator<R, G>[]
  writer: Writer<G>
  log?: boolean
}
