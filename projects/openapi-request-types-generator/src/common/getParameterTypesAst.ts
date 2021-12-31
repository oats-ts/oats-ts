import { factory, TypeNode, TypeReferenceType } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation, RuntimePackages } from '@oats-ts/openapi-common'
import { identity } from 'lodash'

export function getParameterTypesAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  transform: (node: TypeNode) => TypeNode = identity,
): TypeReferenceType[] {
  const { referenceOf } = context
  const { header, query, path, operation } = data

  const commonTypes: TypeReferenceType[] = []

  if (header.length > 0) {
    commonTypes.push(
      factory.createTypeReferenceNode(RuntimePackages.Http.HasHeaders, [
        transform(referenceOf(operation, 'openapi/request-headers-type')),
      ]),
    )
  }

  if (query.length > 0) {
    commonTypes.push(
      factory.createTypeReferenceNode(RuntimePackages.Http.HasQueryParameters, [
        transform(referenceOf(operation, 'openapi/query-type')),
      ]),
    )
  }

  if (path.length > 0) {
    commonTypes.push(
      factory.createTypeReferenceNode(RuntimePackages.Http.HasPathParameters, [
        transform(referenceOf(operation, 'openapi/path-type')),
      ]),
    )
  }

  return commonTypes
}
