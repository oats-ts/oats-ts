import { factory, PropertySignature, TypeNode } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { identity } from 'lodash'

export function getParameterTypesAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  transform: (node: TypeNode) => TypeNode = identity,
): PropertySignature[] {
  const { referenceOf } = context
  const { header, query, path, operation } = data

  const commonTypes: PropertySignature[] = []

  if (header.length > 0) {
    commonTypes.push(
      factory.createPropertySignature(
        undefined,
        'headers',
        undefined,
        transform(referenceOf(operation, 'openapi/request-headers-type')),
      ),
    )
  }

  if (query.length > 0) {
    commonTypes.push(
      factory.createPropertySignature(
        undefined,
        'query',
        undefined,
        transform(referenceOf(operation, 'openapi/query-type')),
      ),
    )
  }

  if (path.length > 0) {
    commonTypes.push(
      factory.createPropertySignature(
        undefined,
        'path',
        undefined,
        transform(referenceOf(operation, 'openapi/path-type')),
      ),
    )
  }

  return commonTypes
}
