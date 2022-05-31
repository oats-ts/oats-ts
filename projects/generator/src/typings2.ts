import { Try } from '@oats-ts/try'
import { Logger } from '@oats-ts/log'

export type ContentReader<R> = (logger: Logger) => Promise<Try<R>>
export type ContentValidator<R> = (data: R, logger: Logger) => Promise<Try<R>>
export type ContentGenerator<R, G> = (data: R, logger: Logger) => Promise<Try<G>>
export type ContentWriter<G> = (data: G, logger: Logger) => Promise<Try<G>>

export type Module<C = any, D = any> = {
  path: string
  content: C[]
  dependencies: D[]
}

export type CodeGenerator<R, G extends Module, P = string, C = string> = {
  id: P
  consumes: C[]
  runtimeDepencencies: string[]
  initialize: (data: R, configuration: GeneratorConfig, generators: CodeGenerator<R, G>[]) => void
  generate: () => Promise<Try<G[]>>
  referenceOf: (input: any) => any
  dependenciesOf: (fromPath: string, input: any) => any[]
}

export type GeneratorInput<R, G> = {
  logger?: Logger
  validator?: ContentValidator<R>
  reader: ContentReader<R>
  generator: ContentGenerator<R, G>
  writer: ContentWriter<G>
}

/**
 * @param input The named object (schema, operation, parameter, etc).
 * @param target The generator target (type definition, operation, etc).
 * @returns The desired name for the object based on target
 */
export type NameProvider = (input: any, target: string) => string

/** Configuration object for generating code from OpenAPI documents. */
export type GeneratorConfig = {
  log: boolean
  /**
   * @param input The named object (schema, operation, parameter, etc).
   * @param originalName The name of the object as described in the document.
   * It's a separate argument, as in many cases it's separate from input object.
   * @param target The generator target (type definition, operation, etc).
   * @returns The desired name based on the parameters.
   */
  nameProvider: GeneratorNameProvider
  /**
   * @param input The named object (schema, operation, parameter, etc).
   * @param name A simplified name provider.
   * @param target The generator target (type definition, operation, etc).
   * @returns The operating system dependent path for the desired generator target.
   */
  pathProvider: GeneratorPathProvider
}

export type GeneratorPathProvider = (input: any, name: NameProvider, target: string) => string | undefined
export type GeneratorNameProvider = (input: any, originalName: string, target: string) => string | undefined
