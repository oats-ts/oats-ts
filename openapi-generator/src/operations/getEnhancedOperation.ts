import { OperationObject, ParameterLocation, ParameterObject, ReferenceObject } from 'openapi3-ts'
import { HttpMethod } from '../../../http/lib'
import { OpenAPIGeneratorContext } from '../typings'
import { EnhancedOperation } from './typings'
export type PartitionedParameters = Record<ParameterLocation, ParameterObject[]>

export function getEnhancedOperation(
  url: string,
  method: HttpMethod,
  operation: OperationObject,
  commonParameters: (ParameterObject | ReferenceObject)[],
  context: OpenAPIGeneratorContext,
): EnhancedOperation {
  const resolved = commonParameters
    .concat(operation.parameters || [])
    .map((param) => context.accessor.dereference(param))
  return {
    url,
    method,
    operation,
    cookie: resolved.filter((param) => param.in === 'cookie'),
    header: resolved.filter((param) => param.in === 'header'),
    query: resolved.filter((param) => param.in === 'query'),
    path: resolved.filter((param) => param.in === 'path'),
  }
}
