import { entries } from 'lodash'
import { OpenAPIObject, PathItemObject } from '@oats-ts/openapi-model'
import { EnhancedPathItem, OpenAPIGeneratorContext } from './typings'
import { EnhancedOperation } from './typings'
import { getEnhancedOperation } from './getEnhancedOperations'

export function getEnhancedPathItems(doc: OpenAPIObject, context: OpenAPIGeneratorContext): EnhancedPathItem[] {
  const paths = entries<PathItemObject>(doc.paths)
  const enhancedPaths: EnhancedPathItem[] = []
  for (const [url, pathItem] of paths) {
    const operations: EnhancedOperation[] = []
    const { get, post, put, patch, trace, options, head, delete: _delete, parameters = [] } = pathItem
    operations.push(...getEnhancedOperation(url, 'get', get, parameters, context, pathItem))
    operations.push(...getEnhancedOperation(url, 'post', post, parameters, context, pathItem))
    operations.push(...getEnhancedOperation(url, 'put', put, parameters, context, pathItem))
    operations.push(...getEnhancedOperation(url, 'patch', patch, parameters, context, pathItem))
    operations.push(...getEnhancedOperation(url, 'trace', trace, parameters, context, pathItem))
    operations.push(...getEnhancedOperation(url, 'options', options, parameters, context, pathItem))
    operations.push(...getEnhancedOperation(url, 'head', head, parameters, context, pathItem))
    operations.push(...getEnhancedOperation(url, 'delete', _delete, parameters, context, pathItem))
    enhancedPaths.push({
      url,
      operations,
      pathItem,
    })
  }
  return enhancedPaths
}
