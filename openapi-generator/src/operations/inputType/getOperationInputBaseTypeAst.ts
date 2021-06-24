import { entries } from 'lodash'
import { factory, PropertySignature, TypeAliasDeclaration } from 'typescript'
import { tsExportModifier } from '../../common/typeScriptUtils'
import { getTypeReferenceAst } from '../../types/getTypeReferenceAst'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getRequestBodyContent } from './getRequestBodyContent'

function getInputTypeParameter(name: string, typeName: string): PropertySignature {
  return factory.createPropertySignature([], name, undefined, factory.createTypeReferenceNode(typeName))
}

export function getOperationInputBaseTypeAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeAliasDeclaration {
  const { accessor } = context
  const { header, query, operation, path } = data

  const properties: PropertySignature[] = []

  if (header.length > 0) {
    properties.push(getInputTypeParameter('headers', accessor.name(operation, 'operation-headers-type')))
  }

  if (query.length > 0) {
    properties.push(getInputTypeParameter('query', accessor.name(operation, 'operation-query-type')))
  }

  if (path.length > 0) {
    properties.push(getInputTypeParameter('path', accessor.name(operation, 'operation-path-type')))
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
        factory.createPropertySignature(
          [],
          'body',
          undefined,
          getTypeReferenceAst(mediaType.schema, context, {
            documentation: false,
            enums: false,
          }),
        ),
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

  const baseTypeName = accessor.name(operation, 'operation-input-type')
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
    bodies.length > 1 ? [] : [tsExportModifier()],
    typeName,
    typeArgs,
    factory.createTypeLiteralNode(properties),
  )
}
