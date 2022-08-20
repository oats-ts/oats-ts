import { entries, isNil } from 'lodash'
import { OpenAPIObject, OperationObject, ParameterObject, PathItemObject } from '@oats-ts/openapi-model'
import { ReferenceObject } from '@oats-ts/json-schema-model'
import { HttpMethod } from '@oats-ts/openapi-http'
import { OpenAPIGeneratorContext } from './typings'
import { EnhancedOperation } from './typings'

function getEnhancedOperation(
  url: string,
  method: HttpMethod,
  operation: OperationObject | undefined,
  commonParameters: (ParameterObject | ReferenceObject)[],
  context: OpenAPIGeneratorContext,
  parent: PathItemObject,
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
      parent,
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
    operations.push(...getEnhancedOperation(url, 'get', get, parameters, context, pathItem))
    operations.push(...getEnhancedOperation(url, 'post', post, parameters, context, pathItem))
    operations.push(...getEnhancedOperation(url, 'put', put, parameters, context, pathItem))
    operations.push(...getEnhancedOperation(url, 'patch', patch, parameters, context, pathItem))
    operations.push(...getEnhancedOperation(url, 'trace', trace, parameters, context, pathItem))
    operations.push(...getEnhancedOperation(url, 'options', options, parameters, context, pathItem))
    operations.push(...getEnhancedOperation(url, 'head', head, parameters, context, pathItem))
    operations.push(...getEnhancedOperation(url, 'delete', _delete, parameters, context, pathItem))
  }
  return operations
}
