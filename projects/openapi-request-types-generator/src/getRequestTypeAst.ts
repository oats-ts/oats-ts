import { entries, isNil } from 'lodash'
import { factory, SyntaxKind, TypeAliasDeclaration, TypeNode } from 'typescript'
import {
  EnhancedOperation,
  getRequestBodyContent,
  OpenAPIGeneratorContext,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { getParameterTypesAst } from './getParameterTypesAst'

function getFullType(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeNode {
  const { referenceOf } = context
  const bodies = entries(getRequestBodyContent(data, context))
  switch (bodies.length) {
    case 0: {
      const common = getParameterTypesAst(data, context)
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
      const common = getParameterTypesAst(data, context)
      const [[mediaType, { schema }]] = bodies
      return factory.createIntersectionTypeNode([
        ...common,
        factory.createTypeReferenceNode(RuntimePackages.Http.HasRequestBody, [
          factory.createLiteralTypeNode(factory.createStringLiteral(mediaType)),
          referenceOf(schema, 'openapi/type'),
        ]),
      ])
    }
    default: {
      return factory.createUnionTypeNode(
        bodies.map(([contentType, mediaType]) =>
          factory.createIntersectionTypeNode([
            ...getParameterTypesAst(data, context),
            factory.createTypeReferenceNode(RuntimePackages.Http.HasRequestBody, [
              factory.createLiteralTypeNode(factory.createStringLiteral(contentType)),
              referenceOf(mediaType.schema, 'openapi/type'),
            ]),
          ]),
        ),
      )
    }
  }
}

export function getRequestTypeAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeAliasDeclaration {
  const { nameOf } = context
  const typeName = nameOf(data.operation, 'openapi/request-type')
  const fullType = getFullType(data, context)
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
