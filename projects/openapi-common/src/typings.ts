import { OpenAPIObject, OperationObject, ParameterObject } from '@oats-ts/openapi-model'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { CodeGenerator } from '@oats-ts/generator'
import { HttpMethod } from '@oats-ts/openapi-http'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { GeneratorContext } from '@oats-ts/model-common'

export type OpenAPIGenerator = CodeGenerator<OpenAPIReadOutput, TypeScriptModule>
export type OpenAPIGeneratorContext = GeneratorContext<OpenAPIObject, OpenAPIGeneratorTarget>

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

export type EnhancedResponse = {
  schema: SchemaObject | ReferenceObject
  statusCode: string
  mediaType: string
}
