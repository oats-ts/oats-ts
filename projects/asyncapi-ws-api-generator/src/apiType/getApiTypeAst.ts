import { AsyncApiObject } from '@oats-ts/asyncapi-model'
import { AsyncAPIGeneratorContext, EnhancedChannel } from '@oats-ts/asyncapi-common'
import { getApiTypeMethodSignatureAst } from './getApiTypeMethodSignatureAst'
import { factory, SyntaxKind, TypeAliasDeclaration } from 'typescript'
import { ApiGeneratorConfig } from '../types'

export function getApiTypeAst(
  document: AsyncApiObject,
  operations: EnhancedChannel[],
  context: AsyncAPIGeneratorContext,
  config: ApiGeneratorConfig,
): TypeAliasDeclaration {
  const { nameOf } = context
  return factory.createTypeAliasDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    nameOf(document, 'asyncapi/api-type'),
    [],
    factory.createTypeLiteralNode(
      operations.map((operation) => getApiTypeMethodSignatureAst(operation, context, config)),
    ),
  )
}
