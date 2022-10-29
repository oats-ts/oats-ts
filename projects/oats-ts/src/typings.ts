import { Try } from '@oats-ts/try'
import {
  GeneratorEventEmitter,
  OatsEventEmitter,
  ReaderEventEmitter,
  ValidatorEventEmitter,
  WriterEventEmitter,
} from './events'
import { SimpleGeneratorResult, CompositeGeneratorResult } from './GeneratorResult'

export type ContentReader<P, R> = (emitter: ReaderEventEmitter<P, R>) => Promise<Try<R>>
export type ContentValidator<P, R> = (data: R, emitter: ValidatorEventEmitter<P>) => Promise<Try<R>>
export type ContentGenerator<R, G> = (data: R, emitter: GeneratorEventEmitter<G>) => Promise<Try<G[]>>
export type ContentWriter<G, O> = (data: G[], emitter: WriterEventEmitter<G, O>) => Promise<Try<O[]>>
export type Logger = (emitter: OatsEventEmitter) => void

export type GeneratorInput<P, R, G, O> = {
  logger?: Logger
  validator?: ContentValidator<P, R>
  reader: ContentReader<P, R>
  generator: ContentGenerator<R, G>
  writer: ContentWriter<G, O>
}

export type GeneratorInit<R, G> = {
  parent?: CodeGenerator<R, G>
  input: R
  globalConfig: GeneratorConfig
  emitter: GeneratorEventEmitter<G>
  dependencies: Try<CodeGenerator<R, G>[]>
}

export type RuntimeDependency = {
  name: string
  version: string
}

export type CodeGenerator<R, G, C = any> = {
  readonly id: string
  name(): string
  produces(): string[]
  consumes(): string[]
  parent(): CodeGenerator<R, G> | undefined
  root(): CodeGenerator<R, G>
  configuration(): C
  runtimeDependencies(): RuntimeDependency[]
  initialize(init: GeneratorInit<R, G>): void
  resolve(name: string): CodeGenerator<R, G> | undefined
  generate(): Promise<CompositeGeneratorResult<G> | SimpleGeneratorResult<G>>
  referenceOf(input: any): any
  dependenciesOf(fromPath: string, input: any): any[]
}

/** Configuration object for generating code from OpenAPI documents. */
export type GeneratorConfig = {
  /**
   * @param input The named object (schema, operation, parameter, etc).
   * @param target The generator target (type definition, operation, etc).
   * @param helper A helper object for simplifying object traversal
   * @returns The desired name based on the parameters.
   */
  nameProvider: (input: any, target: string, helper: NameProviderHelper) => string
  /**
   * @param input The named object (schema, operation, parameter, etc).
   * @param target The generator target (type definition, operation, etc).
   * @param helper A helper object for simplifying object traversal
   * @returns The operating system dependent path for the desired generator target.
   */
  pathProvider: (input: any, target: string, helper: PathProviderHelper) => string

  /**
   * In case runtime library imports would clash with names in your generated code,
   * you can use this to replace import names
   * @param importedName The original imported name
   * @returns The transformed import name
   */
  importReplacer?: (importedName: string) => string
  /**
   * When true, generators with this configuration should emit no outputs from the generate method
   */
  noEmit?: boolean
}

export type NameProviderHelper = {
  uriOf<T>(input: T): string | undefined
  parent<T, P>(input: T): P | undefined
  nameOf<T>(input: T): string | undefined
}

export type PathProviderHelper = {
  uriOf<T>(input: T): string | undefined
  parent<T, P>(input: T): P | undefined
  nameOf<T>(input: T, target: string): string
}

export type NameProvider = (input: any, target: string, helper: NameProviderHelper) => string

export type PathProvider = (input: any, target: string, helper: PathProviderHelper) => string

/** Globaly used utility to work with URIs found in OpenAPI refs and discriminators. */
export type URIManipulatorType = {
  /**
   * @param path A URI fragment.
   * @param segments Possibly other URI fragment pieces.
   * @returns A URI fragment composed from the pieces
   */
  append(path: string, ...segments: (string | number)[]): string
  /**
   * @param ref A partial or full URI (possibly just a fragment).
   * @param parent A full URI.
   * @returns A resolved full URI.
   */
  resolve(ref: string, parent: string): string
  /**
   * @param path A full URI.
   * @returns The URI without any fragments.
   */
  document(path: string): string
  /**
   * @param uri A full or partial URI.
   * @returns It's fragments split by "/"
   */
  fragments(uri: string): string[]

  /**
   * Sets the given fragments as the fragment part of the URI.
   * @param uri
   * @param fragments
   */
  setFragments(uri: string, fragments: string[]): string
}
