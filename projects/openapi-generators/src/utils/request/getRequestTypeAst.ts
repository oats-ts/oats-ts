import { entries, identity, isNil } from 'lodash'
import { factory, PropertySignature, SyntaxKind, TypeAliasDeclaration, TypeNode } from 'typescript'
import { EnhancedOperation, getRequestBodyContent, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getParameterTypesAst } from './getParameterTypesAst'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { PropertyFactory } from './types'

function getBodyTypeProperties(
  mimeType: string,
  schema: Referenceable<SchemaObject>,
  operation: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  createProperty: PropertyFactory,
): PropertySignature[] {
  const { referenceOf, dereference } = context
  const body = dereference(operation.operation.requestBody)
  return [
    factory.createPropertySignature(
      undefined,
      'mimeType',
      body?.required ? undefined : factory.createToken(SyntaxKind.QuestionToken),
      factory.createLiteralTypeNode(factory.createStringLiteral(mimeType)),
    ),
    createProperty('body', referenceOf(schema, 'json-schema/type'), operation, context),
  ]
}

function getFullType(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  createProperty: PropertyFactory,
): TypeNode {
  const bodies = entries(getRequestBodyContent(data, context))
  const paramProps = getParameterTypesAst(data, context, createProperty)
  switch (bodies.length) {
    case 0: {
      return factory.createTypeLiteralNode(paramProps)
    }
    default: {
      return factory.createUnionTypeNode(
        bodies.map(([mimeType, mediaType]) =>
          factory.createTypeLiteralNode([
            ...paramProps,
            ...getBodyTypeProperties(mimeType, mediaType.schema, data, context, createProperty),
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
  createProperty: PropertyFactory,
): TypeAliasDeclaration {
  const fullType = getFullType(data, context, createProperty)
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
