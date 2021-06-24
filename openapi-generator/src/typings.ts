import { OpenAPIObject, ReferenceObject } from 'openapi3-ts'
import type { Issue } from '@oats-ts/validators'
import type { Try } from '@oats-ts/generator'
import type { TypeScriptGeneratorOutput } from '@oats-ts/typescript-writer'

/** Configuration object for generating code from OpenAPI documents. */
export type OpenAPIGeneratorConfig = {
  /**
   * @param input The named object (schema, operation, parameter, etc).
   * @param name The name of the object.
   * @param target The generator target (type definition, operation, etc).
   * @returns The desired name based on the parameters.
   */
  name?(input: any, name: string, target: string): string
  /**
   * @param input The named object (schema, operation, parameter, etc).
   * @param name The name of the object.
   * @param target The generator target (type definition, operation, etc).
   * @returns The operating system dependent path for the desired generator target.
   */
  path(input: any, name: string, target: string): string
}

/** Accessors to make it easy to find information about deeply nested structures. */
export type OpenAPIAccessor = {
  /** @returns The main OpenAPI document.  */
  document(): OpenAPIObject
  /** @returns All the documents referenced from #document()  */
  documents(): OpenAPIObject[]
  /**
   * @param input Either a string ref, a ReferenceObject, the desired target value.
   * @returns The dereferenced value (in case its not a string or a ReferenceObject the value itself).
   */
  dereference<T>(input: string | T | ReferenceObject): T
  /**
   * @param input The named value
   * @param target The generator target (type, operation, etc).
   * @returns The name of the value.
   */
  name(input: any, target: OpenAPIGeneratorTarget): string
  /**
   * @param input The named value
   * @param target The generator target (type, operation, etc).
   * @returns The path for the value.
   */
  path(input: any, target: OpenAPIGeneratorTarget): string
  /**
   * @param input Any object value present in any of #documents().
   * @returns The absolute URI of the value.
   */
  uri(input: any): string
}

export type OpenAPIGeneratorContext = {
  accessor: OpenAPIAccessor
  issues: Issue[]
}

export type OpenAPIChildGenerator = (context: OpenAPIGeneratorContext) => Promise<Try<TypeScriptGeneratorOutput>>

export type OpenAPIGeneratorTarget =
  | 'type'
  | 'type-guard'
  | 'operation'
  | 'operation-query-type'
  | 'operation-path-type'
  | 'operation-headers-type'
  | 'operation-response-type'
  | 'operation-input-type'
  | 'operation-headers-serializer'
  | 'operation-query-serializer'
  | 'operation-path-serializer'
  | 'operation-response-parser-hint'
  | 'api-type'
  | 'api-class'
  | 'api-stub'
  | 'validator'
