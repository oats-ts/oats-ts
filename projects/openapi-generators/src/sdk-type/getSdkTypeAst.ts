import { OpenAPIObject } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getSdkTypeMethodSignatureAst } from './getSdkTypeMethodSignatureAst'
import { factory, SyntaxKind, TypeAliasDeclaration } from 'typescript'
import { SdkGeneratorConfig } from '../utils/sdk/typings'

export function getSdkTypeAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: SdkGeneratorConfig,
): TypeAliasDeclaration {
  return factory.createTypeAliasDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    context.nameOf(document, 'oats/sdk-type'),
    [],
    factory.createTypeLiteralNode(
      operations.map((operation) => getSdkTypeMethodSignatureAst(operation, context, config)),
    ),
  )
}
