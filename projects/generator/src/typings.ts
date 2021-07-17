import { Issue } from '@oats-ts/validators'

export type Result<T> = {
  issues: Issue[]
  isOk: boolean
  data?: T
}

export type ContentReader<R> = () => Promise<Result<R>>
export type ContentValidator<R> = (data: R) => Promise<Issue[]>
export type ContentWriter<G> = (data: G[]) => Promise<Result<G[]>>

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
  referenceOf: (input: any, target: string) => C
  dependenciesOf: (fromPath: string, input: any, target: string) => D[]
}

export type GeneratorInput<R, G extends Module> = {
  reader: ContentReader<R>
  validator: ContentValidator<R>
  generators: CodeGenerator<R, G>[]
  writer: ContentWriter<G>
  log?: boolean
}
