import { factory, ClassDeclaration, SyntaxKind } from 'typescript'
import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../../operations/typings'
import { getApiClassMethodAst } from './getApiClassMethodAst'
import { tsExportModifier, tsPrivateModifier, tsPublicModifier, tsReadonlyKeyword } from '../../common/typeScriptUtils'
import { Http } from '../../common/OatsPackages'

export function getApiClassAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  implement: boolean,
): ClassDeclaration {
  const { accessor } = context

  const configField = factory.createPropertyDeclaration(
    [],
    [tsPrivateModifier(), tsReadonlyKeyword()],
    'config',
    undefined,
    factory.createTypeReferenceNode(Http.RequestConfig),
    undefined,
  )

  const constructor = factory.createConstructorDeclaration(
    [],
    [tsPublicModifier()],
    [
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        'config',
        undefined,
        factory.createTypeReferenceNode(Http.RequestConfig),
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

  const heritageClauses = implement
    ? [
        factory.createHeritageClause(SyntaxKind.ImplementsKeyword, [
          factory.createExpressionWithTypeArguments(factory.createIdentifier(accessor.name(document, 'api-type')), []),
        ]),
      ]
    : []

  return factory.createClassDeclaration(
    [],
    [tsExportModifier()],
    accessor.name(document, 'api-class'),
    [],
    heritageClauses,
    [configField, constructor, ...operations.map((operation) => getApiClassMethodAst(operation, context))],
  )
}
