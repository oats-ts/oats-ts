import { entries } from 'lodash'
import { factory, PropertySignature, SyntaxKind, TypeAliasDeclaration } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation, getRequestBodyContent } from '@oats-ts/openapi-common'

function getInputTypeParameter(name: string, typeName: string): PropertySignature {
  return factory.createPropertySignature([], name, undefined, factory.createTypeReferenceNode(typeName))
}

export function getOperationInputBaseTypeAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeAliasDeclaration {
  const { nameOf, referenceOf } = context
  const { header, query, operation, path } = data

  const properties: PropertySignature[] = []

  if (header.length > 0) {
    properties.push(getInputTypeParameter('headers', nameOf(operation, 'openapi/headers-type')))
  }

  if (query.length > 0) {
    properties.push(getInputTypeParameter('query', nameOf(operation, 'openapi/query-type')))
  }

  if (path.length > 0) {
    properties.push(getInputTypeParameter('path', nameOf(operation, 'openapi/path-type')))
  }

  const bodies = entries(getRequestBodyContent(data, context))

  switch (bodies.length) {
    // No need for body, happy days
    case 0:
      break
    // 1 body, can directly go on the input parameter
    case 1: {
      const [[contentType, mediaType]] = bodies
      properties.push(
        factory.createPropertySignature(
          [],
          'contentType',
          undefined,
          factory.createLiteralTypeNode(factory.createStringLiteral(contentType)),
        ),
      )
      properties.push(
        factory.createPropertySignature([], 'body', undefined, referenceOf(mediaType.schema, 'openapi/type')),
      )
      break
    }
    // More than one, we need generics
    default: {
      properties.push(
        factory.createPropertySignature([], 'contentType', undefined, factory.createTypeReferenceNode('ContentType')),
      )
      properties.push(factory.createPropertySignature([], 'body', undefined, factory.createTypeReferenceNode('Body')))
      break
    }
  }

  const baseTypeName = nameOf(operation, 'openapi/input-type')
  const typeName = bodies.length > 1 ? `_${baseTypeName}` : baseTypeName
  const typeArgs =
    bodies.length > 1
      ? [
          factory.createTypeParameterDeclaration('ContentType', factory.createTypeReferenceNode('string')),
          factory.createTypeParameterDeclaration('Body'),
        ]
      : []

  return factory.createTypeAliasDeclaration(
    [],
    bodies.length > 1 ? [] : [factory.createModifier(SyntaxKind.ExportKeyword)],
    typeName,
    typeArgs,
    factory.createTypeLiteralNode(properties),
  )
}
