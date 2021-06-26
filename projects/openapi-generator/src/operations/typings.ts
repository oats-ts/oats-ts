import { HttpMethod } from '@oats-ts/http'
import { OperationObject, ParameterObject } from 'openapi3-ts'

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

export type OperationsGeneratorConfig = {
  documentation: boolean
}
