import { Try } from '@oats-ts/try'
import {
  GeneratorEventEmitter,
  OatsEventEmitter,
  ReaderEventEmitter,
  ValidatorEventEmitter,
  WriterEventEmitter,
} from './events'
import { SimpleGeneratorResult, CompositeGeneratorResult } from './GeneratorResult'

export type ContentReader<P, R> = {
  name: () => string
  read: (emitter: ReaderEventEmitter<P, R>) => Promise<Try<R>>
}

export type ContentGenerator<R, G> = {
  name: () => string
  generate: (data: R, emitter: GeneratorEventEmitter<G>) => Promise<Try<G[]>>
}

export type ContentValidator<P, R> = {
  name: () => string
  validate: (data: R, emitter: ValidatorEventEmitter<P>) => Promise<Try<R>>
}

export type ContentWriter<G, O> = {
  name: () => string
  write: (data: G[], emitter: WriterEventEmitter<G, O>) => Promise<Try<O[]>>
}

export type OatsPlugin = {
  name: () => string
  addEventListeners: (emitter: OatsEventEmitter) => void
  removeEventListeners: (emitter: OatsEventEmitter) => void
}

export type GeneratorInput<P, R, G, O> = {
  plugins?: OatsPlugin[]
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

export type CodeGenerator<R, G, C = any, Ctx extends GeneratorContext = GeneratorContext> = {
  readonly id: string
  name(): string
  produces(): string[]
  consumes(): string[]
  parent(): CodeGenerator<R, G> | undefined
  root(): CodeGenerator<R, G>
  configuration(): C
  context(): Ctx
  globalConfiguration(): GeneratorConfig
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
  nameProvider: (input: any, target: string, helper: NameProviderHelper) => string | undefined
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
   * @param packageName The package name
   * @param importedName The original imported name
   * @returns The transformed import name
   */
  importReplacer?: (packageName: string, importedName: string) => string | undefined

  /**
   * @param input The named object (schema, operation, parameter, etc), might be undefined.
   * @param target The generator target (type definition, operation, etc).
   * @param local The key of the local name this function may replace.
   * @param helper A helper object for simplifying object traversal.
   * @returns The desired name based on the parameters.
   */
  localNameProvider?: (
    input: any | undefined,
    target: string,
    local: string,
    defaultName: string | undefined,
    helper: LocalNameProviderHelper,
  ) => string | undefined
  /**
   * When true, generators with this configuration should emit no outputs from the generate method
   */
  noEmit?: boolean
}

export type BaseHelper = {
  byUri<T>(uri: string): T | undefined
  uriOf<T>(input: T): string | undefined
  parent<T, P>(input: T): P | undefined
  hashOf<T>(input: T): number | undefined
}

export type NameProviderHelper = BaseHelper & {
  nameOf<T>(input: T): string | undefined
}

export type PathProviderHelper = BaseHelper & {
  nameOf<T>(input: T, target: string): string | undefined
}

export type LocalNameProviderHelper = BaseHelper & {}

export type NameProvider = GeneratorConfig['nameProvider']

export type LocalNameProvider = NonNullable<GeneratorConfig['localNameProvider']>

export type PathProvider = GeneratorConfig['pathProvider']

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

  /**
   * Encodes the given fragment piece
   * @param piece
   */
  encode(piece: string): string

  /**
   * Decodes the given fragment piece
   * @param piece
   */
  decode(piece: string): string
}

export type GeneratorContext<D = any, Target extends string = string> = {
  /** Returns the root document, that's being processed */
  document(): D
  /** Returns the root and all referenced documents */
  documents(): D[]

  nameOf(input: any): string
  /**
   * @param input The named value
   * @param target The generator target (type, operation, etc).
   * @returns The name of the value.
   */
  nameOf(input: any, target: Target): string
  /**
   * @param input The possibly named value
   * @param target The generator target (type, operation, etc).
   * @returns true if the item has an intristic name (most likely from outer object key), false otherwise.
   */
  hasName(input: any, target?: Target): boolean
  /**
   * @param input The named value
   * @param target The generator target (type, operation, etc).
   * @returns The name of the value.
   */
  localNameOf<L extends string>(input: any | undefined, target: Target, local: L): string
  /**
   * @param input The named value
   * @param target The generator target (type, operation, etc).
   * @returns The path for the value.
   */
  pathOf(input: any, target: Target): string
  /**
   * @param input Any object value present in any of #documents().
   * @returns The absolute URI of the value.
   */
  uriOf(input: any): string
  /**
   * @param input Any value present (or not) in any of #documents().
   * @returns true if the given value has a valid URI (part of a document) false otherwise
   */
  hasUri(input: any): boolean
  /**
   * @param input Any object or array value in the OpenAPI document.
   * @returns A hash number for the given value.
   */
  hashOf(input: any): number
  /**
   * Generator specific reference to the given input and target
   * @param input The input for which the reference is needed. For example SchemaObject
   * @param target The generator target, for example "type" or "validator"
   */
  referenceOf<T>(input: any, target: Target): T
  /**
   * Returns the configuration for the given generator target.
   * @param target The generator target
   */
  configurationOf<T>(target: Target): T
  /**
   * @param uri The absolute URI of the object you are looking for.
   * @returns The object associated with this URI.
   */
  byUri<T>(uri: string): T | undefined
  /**
   * Returns the exported value's name.
   * @param packageName The package that owns the export
   * @param exportName The original exported name.
   */
  exportOf(packageName: string, exportName: string): string
  /**
   * Generator specific dependencies to the given input and target. Returns imports for reference.
   * @param fromPath The path from wich you are referencing from.
   * @param input The input for which the deps are needed for. For example SchemaObject
   * @param target The generator target, for example "type" or "validator"
   */
  dependenciesOf<T>(fromPath: string, input: any, target: Target): T[]
}
