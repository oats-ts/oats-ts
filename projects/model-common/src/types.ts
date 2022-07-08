import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { ImportDeclaration } from 'typescript'

export type ReadOutput<D> = {
  /** The full URI of the root document */
  documentUri: string
  /** The root document */
  document: D
  /** An URI -> document map. Contains all referenced documents fully resolved. */
  documents: Map<string, D>
  /** An object -> URI mapping for all the objects the resolution traversed */
  objectToUri: Map<any, string>
  /** An URI -> object mapping for all the objects the resolution traversed */
  uriToObject: Map<string, any>
  /** An object -> name mapping for entites that don't encapsulate their names, eg.: schemas. */
  objectToName: Map<any, string>
}

export type GeneratorContext<D = any, Target extends string = string> = {
  /** @returns The main OpenAPI document.  */
  readonly document: D
  /** @returns All the documents referenced from #document()  */
  readonly documents: D[]
  /**
   * @param input Either a string ref, a ReferenceObject, the desired target value.
   * @returns The dereferenced value (in case its not a string or a ReferenceObject the value itself).
   */
  dereference<T>(input: string | T | ReferenceObject, deep?: boolean): T

  nameOf(input: any): string | undefined
  /**
   * @param input The named value
   * @param target The generator target (type, operation, etc).
   * @returns The name of the value.
   */
  nameOf(input: any, target: Target): string
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
   * Generator specific reference to the given input and target
   * @param input The input for which the reference is needed. For example SchemaObject
   * @param target The generator target, for example "type" or "validator"
   */
  referenceOf<T>(input: any, target: Target): T
  /**
   * Generator specific dependencies to the given input and target. Returns imports for reference.
   * @param fromPath The path from wich you are referencing from.
   * @param input The input for which the deps are needed for. For example SchemaObject
   * @param target The generator target, for example "type" or "validator"
   */
  dependenciesOf(fromPath: string, input: any, target: Target): ImportDeclaration[]
}

export type HasSchemas = {
  components?: {
    schemas?: Record<string, Referenceable<SchemaObject>>
  }
}

export type InferredType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'enum'
  | 'literal'
  | 'object'
  | 'array'
  | 'tuple'
  | 'record'
  | 'union'
  | 'intersection'
  | 'unknown'
  | 'ref'
