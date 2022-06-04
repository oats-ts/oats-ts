import { Try } from '@oats-ts/try'
import { GeneratorEventEmitter } from '@oats-ts/events'

export type GeneratorInit<R, G> = {
  parent?: CodeGenerator<R, G>
  input: R
  config: GeneratorConfig
  emitter: GeneratorEventEmitter<G>
  dependencies: CodeGenerator<R, G>[]
}

export type CodeGenerator<R, G> = {
  readonly id: string
  name(): string
  produces(): string[]
  consumes(): string[]
  runtimeDependencies(): string[]
  initialize(init: GeneratorInit<R, G>): void
  resolve(name: string): CodeGenerator<R, G> | undefined
  generate(): Promise<Try<G[]>>
  referenceOf<Model = any, Code = any>(input: Model): Code
  dependenciesOf<Model = any, Dep = any>(fromPath: string, input: Model): Dep[]
}

/**
 * @param input The named object (schema, operation, parameter, etc).
 * @param target The generator target (type definition, operation, etc).
 * @returns The desired name for the object based on target
 */
export type NameProvider = (input: any, target: string) => string

/** Configuration object for generating code from OpenAPI documents. */
export type GeneratorConfig = {
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
