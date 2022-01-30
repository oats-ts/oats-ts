import { factory, ClassDeclaration, SyntaxKind } from 'typescript'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { RuntimePackages, EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getSdkClassMethodAst } from './getSdkClassMethodAst'
import { SdkGeneratorConfig } from '../typings'

export function getSdkClassAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: SdkGeneratorConfig,
): ClassDeclaration {
  const { nameOf } = context

  const configField = factory.createPropertyDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ProtectedKeyword), factory.createModifier(SyntaxKind.ReadonlyKeyword)],
    'config',
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
        'config',
        undefined,
        factory.createTypeReferenceNode(RuntimePackages.Http.ClientAdapter),
      ),
    ],
    factory.createBlock([
      factory.createExpressionStatement(
        factory.createBinaryExpression(
          factory.createPropertyAccessExpression(factory.createIdentifier('this'), 'config'),
          SyntaxKind.EqualsToken,
          factory.createIdentifier('config'),
        ),
      ),
    ]),
  )

  return factory.createClassDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    nameOf(document, 'openapi/sdk-impl'),
    [],
    [
      factory.createHeritageClause(SyntaxKind.ImplementsKeyword, [
        factory.createExpressionWithTypeArguments(factory.createIdentifier(nameOf(document, 'openapi/sdk-type')), []),
      ]),
    ],
    [configField, constructor, ...operations.map((operation) => getSdkClassMethodAst(operation, context))],
  )
}
