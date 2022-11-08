import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { GeneratorContext, PathProviderHelper } from '@oats-ts/oats-ts'

export type ReadOutput<D> = {
  /** The full URI of the root document */
  readonly documentUri: string
  /** The root document */
  readonly document: D
  /** An URI -> document map. Contains all referenced documents fully resolved. */
  readonly documents: Map<string, D>
  /** An object -> URI mapping for all the objects the resolution traversed */
  readonly objectToUri: Map<any, string>
  /** An URI -> object mapping for all the objects the resolution traversed */
  readonly uriToObject: Map<string, any>
  /** An object -> name mapping for entites that don't encapsulate their names, eg.: schemas. */
  readonly objectToName: Map<any, string>
  /** An object -> hash mapping for entites. Helpful for unique identifiers, as JS doesn't provide an alternative. */
  readonly objectToHash: Map<any, number>
}

export type HasSchemas = {
  components?: {
    schemas?: Record<string, Referenceable<SchemaObject>>
  }
}

export type JsonSchemaBasedGeneratorContext<D = any, Target extends string = string> = GeneratorContext<D, Target> & {
  /**
   * @param input Either a string ref, a ReferenceObject, the desired target value.
   * @returns The dereferenced value (in case its not a string or a ReferenceObject the value itself).
   */
  dereference<T>(input: string | Referenceable<T>, deep?: boolean): T
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

export type RuntimePackageInternal<T extends Record<string, string>, C> = {
  name: string
  exports: T
  content: C
}

export type RuntimePackage<Exports extends Record<string, string>, Content> = {
  name: string
  exports: Exports
  imports: Record<keyof Exports, string | [string, string]>
  content: Content
}

export type LocalNameDefaults = Record<string, string | ((input: any, helper: PathProviderHelper) => string)>
