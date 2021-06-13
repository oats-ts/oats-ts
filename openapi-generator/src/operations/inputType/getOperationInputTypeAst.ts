import {
  ExportNamedDeclaration,
  exportNamedDeclaration,
  identifier,
  tsPropertySignature,
  TSPropertySignature,
  tsTypeAliasDeclaration,
  tsTypeAnnotation,
  tsTypeLiteral,
  tsTypeReference,
} from '@babel/types'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'

function getInputTypeParameter(name: string, typeName: string): TSPropertySignature {
  return tsPropertySignature(identifier(name), tsTypeAnnotation(tsTypeReference(identifier(typeName))))
}

export function getOperationInputTypeAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ExportNamedDeclaration {
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

  return exportNamedDeclaration(
    tsTypeAliasDeclaration(
      identifier(accessor.name(operation, 'operation-input-type')),
      undefined,
      tsTypeLiteral(properties),
    ),
  )
}
