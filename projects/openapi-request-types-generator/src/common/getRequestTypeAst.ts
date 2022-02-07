import { entries, identity, isNil } from 'lodash'
import { factory, SyntaxKind, TypeAliasDeclaration, TypeNode } from 'typescript'
import {
  EnhancedOperation,
  getRequestBodyContent,
  OpenAPIGeneratorContext,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { getParameterTypesAst } from './getParameterTypesAst'

function getFullType(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  transform: (node: TypeNode) => TypeNode = identity,
): TypeNode {
  const { referenceOf } = context
  const bodies = entries(getRequestBodyContent(data, context))
  switch (bodies.length) {
    case 0: {
      const common = getParameterTypesAst(data, context, transform)
      switch (common.length) {
        case 0:
          return undefined
        case 1:
          return common[0]
        default:
          return common.length > 0 ? factory.createIntersectionTypeNode(common) : undefined
      }
    }
    case 1: {
      const common = getParameterTypesAst(data, context, transform)
      const [[mediaType, { schema }]] = bodies
      return factory.createIntersectionTypeNode([
        ...common,
        factory.createTypeReferenceNode(RuntimePackages.Http.HasRequestBody, [
          factory.createLiteralTypeNode(factory.createStringLiteral(mediaType)),
          transform(referenceOf(schema, 'json-schema/type')),
        ]),
      ])
    }
    default: {
      return factory.createUnionTypeNode(
        bodies.map(([contentType, mediaType]) =>
          factory.createIntersectionTypeNode([
            ...getParameterTypesAst(data, context, transform),
            factory.createTypeReferenceNode(RuntimePackages.Http.HasRequestBody, [
              factory.createLiteralTypeNode(factory.createStringLiteral(contentType)),
              transform(referenceOf(mediaType.schema, 'json-schema/type')),
            ]),
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
