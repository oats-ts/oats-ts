import { OpenAPIObject, ReferenceObject, OperationObject, ParameterObject } from 'openapi3-ts'
import { Issue } from '@oats-ts/validators'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { CodeGenerator } from '@oats-ts/generator'
import { HttpMethod } from '@oats-ts/http'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'

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

  /**
   * Generator specific reference to the given input and target
   * @param input The input for which the reference is needed. For example SchemaObject
   * @param target The generator target, for example "type" or "validator"
   */
  reference<T>(input: any, target: OpenAPIGeneratorTarget): T
}

export type OpenAPIGeneratorContext = {
  accessor: OpenAPIAccessor
  issues: Issue[]
}

export type OpenAPIGenerator = CodeGenerator<OpenAPIReadOutput, TypeScriptModule>

/**
 * Type to contain all the related stuff for an operation.
 * It exists to prevent passing around a large amount of parameters.
 */
export type EnhancedOperation = {
  url: string
  method: HttpMethod
  operation: OperationObject
  query: ParameterObject[]
  path: ParameterObject[]
  cookie: ParameterObject[]
  header: ParameterObject[]
}
