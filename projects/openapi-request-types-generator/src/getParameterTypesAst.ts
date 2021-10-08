import { factory, TypeReferenceType } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation, RuntimePackages } from '@oats-ts/openapi-common'

export function getParameterTypesAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeReferenceType[] {
  const { referenceOf } = context
  const { header, query, path, operation } = data

  const commonTypes: TypeReferenceType[] = []

  if (header.length > 0) {
    commonTypes.push(
      factory.createTypeReferenceNode(RuntimePackages.Http.HasHeaders, [
        referenceOf(operation, 'openapi/headers-type'),
      ]),
    )
  }

  if (query.length > 0) {
    commonTypes.push(
      factory.createTypeReferenceNode(RuntimePackages.Http.HasQueryParameters, [
        referenceOf(operation, 'openapi/query-type'),
      ]),
    )
  }

  if (path.length > 0) {
    commonTypes.push(
      factory.createTypeReferenceNode(RuntimePackages.Http.HasPathParameters, [
        referenceOf(operation, 'openapi/path-type'),
      ]),
    )
  }

  return commonTypes
}
