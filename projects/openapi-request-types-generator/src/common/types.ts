import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { PropertySignature, TypeNode } from 'typescript'

export type RequestPropertyName = 'headers' | 'path' | 'query' | 'body'

export type PropertyFactory = (
  name: RequestPropertyName,
  type: TypeNode,
  operation: EnhancedOperation,
  context: OpenAPIGeneratorContext,
) => PropertySignature
