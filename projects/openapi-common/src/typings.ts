import {
  HeadersObject,
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  PathItemObject,
  ContentObject,
  MediaTypeObject,
  RequestBodyObject,
  ResponseObject,
  ComponentsObject,
  HeaderObject,
} from '@oats-ts/openapi-model'
import { NameProvider, PathProviderHelper } from '@oats-ts/oats-ts'
import { HttpMethod } from '@oats-ts/openapi-http'
import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { GeneratorContext, LocalNameProviderHelper } from '@oats-ts/oats-ts'

/**
 * @param input The object (schema, operation, parameter, etc).
 * @param target The generator target (type definition, operation, etc).
 * @returns The desired path for the object based on target
 */
export type PathProvider = (input: any, target: string) => string

export type NameByTarget = Record<OpenAPIGeneratorTarget, string>

export type PathDelegate = (basePath: string, input: any, target: string, helper: PathProviderHelper) => string

export type DelegatingPathProviderInput = Record<OpenAPIGeneratorTarget, PathDelegate>
export type DelegatingNameProviderInput = Record<OpenAPIGeneratorTarget, NameProvider>

export type OpenAPIGeneratorTarget =
  // Common
  | 'oats/type'
  | 'oats/type-guard'
  | 'oats/type-validator'
  | 'oats/request-body-validator'
  | 'oats/response-body-validator'
  | 'oats/query-type'
  | 'oats/path-type'
  | 'oats/cookies-type'
  | 'oats/request-headers-type'
  | 'oats/response-headers-type'
  | 'oats/response-type'
  | 'oats/response-server-type'
  | 'oats/request-type'
  | 'oats/request-server-type'
  | 'oats/operation'
  | 'oats/sdk-type'
  | 'oats/sdk-impl'
  | 'oats/api-type'
  | 'oats/cors-configuration'
  | 'oats/express-router-factory'
  | 'oats/express-router-factories-type'
  | 'oats/express-app-router-factory'
  | 'oats/express-cors-router-factory'
  | 'oats/express-context-router-factory'
  | 'oats/request-header-parameters'
  | 'oats/response-header-parameters'
  | 'oats/query-parameters'
  | 'oats/path-parameters'
  | 'oats/cookie-parameters'

/**
 * Type to contain all the related stuff for an operation.
 * It exists to prevent passing around a large amount of parameters.
 */
export type EnhancedOperation = {
  url: string
  method: HttpMethod
  operation: OperationObject
  parent: PathItemObject
  query: ParameterObject[]
  path: ParameterObject[]
  cookie: ParameterObject[]
  header: ParameterObject[]
}

export type EnhancedPathItem = {
  url: string
  pathItem: PathItemObject
  operations: EnhancedOperation[]
}

export type EnhancedResponse = {
  schema?: SchemaObject | ReferenceObject
  mediaType?: string
  statusCode: string
  headers: HeadersObject
}

export type ParameterKind = 'primitive' | 'object' | 'array' | 'unknown'
export type FundamentalType = 'primitive' | 'object' | 'array' | 'nil' | 'unknown'
export type PrimitiveType = 'boolean' | 'string' | 'number' | 'nil' | 'non-primitive'

export type OpenAPIVisitor<I> = {
  visitOpenAPIObject(data: OpenAPIObject, input: I): boolean
  visitComponentsObject(data: ComponentsObject, input: I): boolean
  visitPathItemObject(data: PathItemObject, input: I): boolean
  visitOperationObject(data: OperationObject, input: I): boolean
  visitResponseObject(data: ResponseObject, input: I): boolean
  visitParameterObject(data: ParameterObject, input: I): boolean
  visitHeaderObject(data: HeaderObject, input: I): boolean
  visitRequestBodyObject(data: RequestBodyObject, input: I): boolean
  visitContentObject(data: ContentObject, input: I): boolean
  visitMediaTypeObject(data: MediaTypeObject, input: I): boolean
  visitSchemaObject(data: SchemaObject, input: I): boolean
  visitReferenceObject(data: ReferenceObject, input: I): boolean
}

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

export type OpenAPIGeneratorContext = GeneratorContext<OpenAPIObject, OpenAPIGeneratorTarget> & {
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

export type LocalNameDefaults = Record<string, string | ((input: any, helper: LocalNameProviderHelper) => string)>

export type OpenAPIReadOutput = {
  /** The full URI of the root document */
  readonly documentUri: string
  /** The root OpenAPI document */
  readonly document: OpenAPIObject
  /** An URI -> OpenAPI document map. Contains all referenced documents fully resolved. */
  readonly documents: Map<string, OpenAPIObject>
  /** An object -> URI mapping for all the objects the resolution traversed */
  readonly objectToUri: Map<any, string>
  /** An URI -> object mapping for all the objects the resolution traversed */
  readonly uriToObject: Map<string, any>
  /** An object -> name mapping for entites that don't encapsulate their names, eg.: schemas. */
  readonly objectToName: Map<any, string>
  /** An object -> hash mapping for entites. Helpful for unique identifiers, as JS doesn't provide an alternative. */
  readonly objectToHash: Map<OpenAPIObject, number>
}
