import { factory, ClassDeclaration, SyntaxKind } from 'typescript'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { RuntimePackages, EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getSdkClassMethodAst } from './getSdkClassMethodAst'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { Names } from './Names'

export function getSdkClassAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: SdkGeneratorConfig,
): ClassDeclaration {
  const configField = factory.createPropertyDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ProtectedKeyword), factory.createModifier(SyntaxKind.ReadonlyKeyword)],
    Names.adapter,
    undefined,
    factory.createTypeReferenceNode(RuntimePackages.Http.ClientAdapter),
    undefined,
  )

  const constructor = factory.createConstructorDeclaration(
    [],
    [factory.createModifier(SyntaxKind.PublicKeyword)],
    [
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        Names.adapter,
        undefined,
        factory.createTypeReferenceNode(RuntimePackages.Http.ClientAdapter),
      ),
    ],
    factory.createBlock([
      factory.createExpressionStatement(
        factory.createBinaryExpression(
          factory.createPropertyAccessExpression(factory.createIdentifier('this'), Names.adapter),
          SyntaxKind.EqualsToken,
          factory.createIdentifier(Names.adapter),
        ),
      ),
    ]),
  )

  return factory.createClassDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    context.nameOf(document, 'oats/sdk-impl'),
    [],
    [
      factory.createHeritageClause(SyntaxKind.ImplementsKeyword, [
        factory.createExpressionWithTypeArguments(
          factory.createIdentifier(context.nameOf(document, 'oats/sdk-type')),
          [],
        ),
      ]),
    ],
    [configField, constructor, ...operations.map((operation) => getSdkClassMethodAst(operation, context, config))],
  )
}
