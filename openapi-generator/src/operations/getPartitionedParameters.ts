import { OperationObject, ParameterLocation, ParameterObject, ReferenceObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'

export type PartitionedParameters = Record<ParameterLocation, ParameterObject[]>

export function getPartitionedParameters(
  operation: OperationObject,
  parameters: (ParameterObject | ReferenceObject)[],
  context: OpenAPIGeneratorContext,
): PartitionedParameters {
  const resolved = parameters.concat(operation.parameters || []).map((param) => context.accessor.dereference(param))
  return {
    cookie: resolved.filter((param) => param.in === 'cookie'),
    header: resolved.filter((param) => param.in === 'header'),
    query: resolved.filter((param) => param.in === 'query'),
    path: resolved.filter((param) => param.in === 'path'),
  }
}
