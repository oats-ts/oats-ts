import { factory, ClassDeclaration, SyntaxKind } from 'typescript'
import { OpenAPIObject } from 'openapi3-ts'
import { RuntimePackages, EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getApiClassMethodAst } from './getApiClassMethodAst'
import { ApiGeneratorConfig } from '../typings'

export function getApiClassAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ApiGeneratorConfig,
): ClassDeclaration {
  const { accessor } = context

  const configField = factory.createPropertyDeclaration(
    [],
    [factory.createModifier(SyntaxKind.PrivateKeyword), factory.createModifier(SyntaxKind.ReadonlyKeyword)],
    'config',
    undefined,
    factory.createTypeReferenceNode(RuntimePackages.Http.RequestConfig),
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
        factory.createTypeReferenceNode(RuntimePackages.Http.RequestConfig),
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

  const heritageClauses = config.type
    ? [
        factory.createHeritageClause(SyntaxKind.ImplementsKeyword, [
          factory.createExpressionWithTypeArguments(factory.createIdentifier(accessor.name(document, 'api-type')), []),
        ]),
      ]
    : []

  return factory.createClassDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    accessor.name(document, 'api-class'),
    [],
    heritageClauses,
    [configField, constructor, ...operations.map((operation) => getApiClassMethodAst(operation, context))],
  )
}
