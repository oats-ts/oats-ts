import {
  ExportNamedDeclaration,
  exportNamedDeclaration,
  identifier,
  stringLiteral,
  tsLiteralType,
  tsPropertySignature,
  TSPropertySignature,
  tsStringKeyword,
  TSTypeAliasDeclaration,
  tsTypeAliasDeclaration,
  tsTypeAnnotation,
  tsTypeLiteral,
  tsTypeParameter,
  tsTypeParameterDeclaration,
  tsTypeReference,
} from '@babel/types'
import { entries } from 'lodash'
import { getTypeReferenceAst } from '../../schemas/types/getTypeReferenceAst'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getRequestBodyContent } from './getRequestBodyContent'

function getInputTypeParameter(name: string, typeName: string): TSPropertySignature {
  return tsPropertySignature(identifier(name), tsTypeAnnotation(tsTypeReference(identifier(typeName))))
}

export function getOperationInputBaseTypeAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ExportNamedDeclaration | TSTypeAliasDeclaration {
  const { accessor } = context
  const { header, query, operation, path } = data

  const properties: TSPropertySignature[] = []

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
        tsPropertySignature(identifier('contentType'), tsTypeAnnotation(tsLiteralType(stringLiteral(contentType)))),
      )
      properties.push(
        tsPropertySignature(identifier('body'), tsTypeAnnotation(getTypeReferenceAst(mediaType.schema, context))),
      )
      break
    }
    // More than one, we need generics
    default: {
      properties.push(
        tsPropertySignature(identifier('contentType'), tsTypeAnnotation(tsTypeReference(identifier('ContentType')))),
      )
      properties.push(tsPropertySignature(identifier('body'), tsTypeAnnotation(tsTypeReference(identifier('Body')))))
      break
    }
  }

  const baseTypeName = accessor.name(operation, 'operation-input-type')
  const typeName = bodies.length > 1 ? `_${baseTypeName}` : baseTypeName
  const typeArgs =
    bodies.length > 1
      ? tsTypeParameterDeclaration([
          tsTypeParameter(tsStringKeyword(), undefined, 'ContentType'),
          tsTypeParameter(undefined, undefined, 'Body'),
        ])
      : undefined

  const typeDecl = tsTypeAliasDeclaration(identifier(typeName), typeArgs, tsTypeLiteral(properties))

  return bodies.length > 1 ? typeDecl : exportNamedDeclaration(typeDecl)
}
