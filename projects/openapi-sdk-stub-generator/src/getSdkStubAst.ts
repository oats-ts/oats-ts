import { OpenAPIObject } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getSdkStubMethodAst } from './getSdkStubMethodAst'
import { ClassDeclaration, factory, SyntaxKind } from 'typescript'
import { SdkStubGeneratorConfig } from './typings'

export function getSdkStubAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: SdkStubGeneratorConfig,
): ClassDeclaration {
  const { nameOf } = context

  return factory.createClassDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    nameOf(document, 'openapi/sdk-stub'),
    [],
    [
      factory.createHeritageClause(SyntaxKind.ImplementsKeyword, [
        factory.createExpressionWithTypeArguments(factory.createIdentifier(nameOf(document, 'openapi/sdk-type')), []),
      ]),
    ],
    operations.map((operation) => getSdkStubMethodAst(operation, context)),
  )
}
