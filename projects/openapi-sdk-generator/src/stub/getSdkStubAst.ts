import { OpenAPIObject } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getSdkStubMethodAst } from './getSdkStubMethodAst'
import { ClassDeclaration, factory, SyntaxKind } from 'typescript'
import { SdkGeneratorConfig } from '../typings'

export function getSdkStubAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: SdkGeneratorConfig,
): ClassDeclaration {
  const { nameOf } = context

  const heritageClauses = config.type
    ? [
        factory.createHeritageClause(SyntaxKind.ImplementsKeyword, [
          factory.createExpressionWithTypeArguments(factory.createIdentifier(nameOf(document, 'openapi/sdk-type')), []),
        ]),
      ]
    : []

  return factory.createClassDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    nameOf(document, 'openapi/sdk-stub'),
    [],
    heritageClauses,
    operations.map((operation) => getSdkStubMethodAst(operation, context)),
  )
}
