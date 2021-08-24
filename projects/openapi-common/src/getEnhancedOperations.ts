import { entries, isNil } from 'lodash'
import { OpenAPIObject, OperationObject, ParameterObject, PathItemObject } from '@oats-ts/openapi-model'
import { ReferenceObject } from '@oats-ts/json-schema-model'
import { HttpMethod } from '@oats-ts/http'
import { OpenAPIGeneratorContext } from './typings'
import { EnhancedOperation } from './typings'

function getEnhancedOperation(
  url: string,
  method: HttpMethod,
  operation: OperationObject,
  commonParameters: (ParameterObject | ReferenceObject)[],
  context: OpenAPIGeneratorContext,
): EnhancedOperation[] {
  const { dereference } = context
  if (isNil(operation)) {
    return []
  }
  const resolved = commonParameters.concat(operation.parameters || []).map((param) => dereference(param))
  return [
    {
      url,
      method,
      operation,
      cookie: resolved.filter((param) => param.in === 'cookie'),
      header: resolved.filter((param) => param.in === 'header'),
      query: resolved.filter((param) => param.in === 'query'),
      path: resolved.filter((param) => param.in === 'path'),
    },
  ]
}

export function getEnhancedOperations(doc: OpenAPIObject, context: OpenAPIGeneratorContext): EnhancedOperation[] {
  const operations: EnhancedOperation[] = []
  const paths = entries<PathItemObject>(doc.paths)
  for (const [url, pathItem] of paths) {
    const { get, post, put, patch, trace, options, head, delete: _delete, parameters = [] } = pathItem
    operations.push(...getEnhancedOperation(url, 'get', get, parameters, context))
    operations.push(...getEnhancedOperation(url, 'post', post, parameters, context))
    operations.push(...getEnhancedOperation(url, 'put', put, parameters, context))
    operations.push(...getEnhancedOperation(url, 'patch', patch, parameters, context))
    operations.push(...getEnhancedOperation(url, 'trace', trace, parameters, context))
    operations.push(...getEnhancedOperation(url, 'options', options, parameters, context))
    operations.push(...getEnhancedOperation(url, 'head', head, parameters, context))
    operations.push(...getEnhancedOperation(url, 'delete', _delete, parameters, context))
  }
  return operations
}
