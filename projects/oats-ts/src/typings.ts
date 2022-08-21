import { Try } from '@oats-ts/try'
import {
  GeneratorEventEmitter,
  OatsEventEmitter,
  ReaderEventEmitter,
  ValidatorEventEmitter,
  WriterEventEmitter,
} from './events'

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

export type StructuredGeneratorResult<G> = { [key: string]: Try<G[]> | StructuredGeneratorResult<G> }

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

export type CodeGenerator<R, G> = {
  readonly id: string
  name(): string
  produces(): string[]
  consumes(): string[]
  runtimeDependencies(): RuntimeDependency[]
  initialize(init: GeneratorInit<R, G>): void
  resolve(name: string): CodeGenerator<R, G> | undefined
  generate(): Promise<StructuredGeneratorResult<G> | Try<G[]>>
  referenceOf(input: any): any
  dependenciesOf(fromPath: string, input: any): any[]
}

/** Configuration object for generating code from OpenAPI documents. */
export type GeneratorConfig = {
  /**
   * @param input The named object (schema, operation, parameter, etc).
   * @param originalName The name of the object as described in the document.
   * It's a separate argument, as in many cases it's separate from input object.
   * @param target The generator target (type definition, operation, etc).
   * @returns The desired name based on the parameters.
   */
  nameProvider: NameProvider
  /**
   * @param input The named object (schema, operation, parameter, etc).
   * @param name A simplified name provider.
   * @param target The generator target (type definition, operation, etc).
   * @returns The operating system dependent path for the desired generator target.
   */
  pathProvider: PathProvider
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
