import { PropertySignature } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { PropertyFactory } from './types'

export function getParameterTypesAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  createProperty: PropertyFactory,
): PropertySignature[] {
  const { referenceOf } = context
  const { header, query, path, operation } = data

  const commonTypes: PropertySignature[] = []

  if (header.length > 0) {
    commonTypes.push(createProperty('headers', referenceOf(operation, 'oats/request-headers-type'), data, context))
  }

  if (query.length > 0) {
    commonTypes.push(createProperty('query', referenceOf(operation, 'oats/query-type'), data, context))
  }

  if (path.length > 0) {
    commonTypes.push(createProperty('path', referenceOf(operation, 'oats/path-type'), data, context))
  }

  return commonTypes
}
