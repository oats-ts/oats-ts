import { Try } from '@oats-ts/try'
import { GeneratorEventEmitter } from '@oats-ts/events'

export type GeneratorInit<R, G> = {
  parent?: CodeGenerator<R, G>
  input: R
  globalConfig: GeneratorConfig
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
  referenceOf(input: any): any
  dependenciesOf(fromPath: string, input: any): any[]
}

/**
 * @param input The named object (schema, operation, parameter, etc).
 * @param target The generator target (type definition, operation, etc).
 * @returns The desired name for the object based on target
 */
export type NameProvider = (input: any, target: string) => string | undefined

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
  /**
   * When true, generators with this configuration should emit no outputs from the generate method
   */
  noEmit?: boolean
}

export type GeneratorPathProvider = (input: any, name: NameProvider, target: string) => string
export type GeneratorNameProvider = (input: any, originalName: string | undefined, target: string) => string
