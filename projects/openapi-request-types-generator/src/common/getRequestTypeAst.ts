import { entries, identity, isNil } from 'lodash'
import { factory, PropertySignature, SyntaxKind, TypeAliasDeclaration, TypeNode } from 'typescript'
import { EnhancedOperation, getRequestBodyContent, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getParameterTypesAst } from './getParameterTypesAst'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'

function getBodyTypeProperties(
  mimeType: string,
  schema: Referenceable<SchemaObject>,
  context: OpenAPIGeneratorContext,
  transform: (node: TypeNode) => TypeNode,
): PropertySignature[] {
  const { referenceOf } = context
  return [
    factory.createPropertySignature(
      undefined,
      'mimeType',
      undefined,
      factory.createLiteralTypeNode(factory.createStringLiteral(mimeType)),
    ),
    factory.createPropertySignature(undefined, 'body', undefined, transform(referenceOf(schema, 'json-schema/type'))),
  ]
}

function getFullType(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  transform: (node: TypeNode) => TypeNode = identity,
): TypeNode {
  const bodies = entries(getRequestBodyContent(data, context))
  const paramProps = getParameterTypesAst(data, context, transform)
  switch (bodies.length) {
    case 0: {
      return factory.createTypeLiteralNode(paramProps)
    }
    default: {
      return factory.createUnionTypeNode(
        bodies.map(([mimeType, mediaType]) =>
          factory.createTypeLiteralNode([
            ...paramProps,
            ...getBodyTypeProperties(mimeType, mediaType.schema, context, transform),
          ]),
        ),
      )
    }
  }
}

export function getRequestTypeAst(
  typeName: string,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  transform: (node: TypeNode) => TypeNode = identity,
): TypeAliasDeclaration {
  const fullType = getFullType(data, context, transform)
  return isNil(fullType)
    ? undefined
    : factory.createTypeAliasDeclaration(
        [],
        [factory.createModifier(SyntaxKind.ExportKeyword)],
        typeName,
        undefined,
        fullType,
      )
}
