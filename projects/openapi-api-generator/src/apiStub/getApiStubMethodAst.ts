import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getApiMethodParameterAsts } from '../apiClass/getApiMethodParameterAsts'
import { getApiMethodReturnTypeAst } from '../apiClass/getApiMethodReturnTypeAst'
import { factory, MethodDeclaration, SyntaxKind } from 'typescript'

export function getApiStubMethodAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): MethodDeclaration {
  const { accessor } = context

  const returnStatement = factory.createReturnStatement(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('this'), 'fallback'),
      [],
      [],
    ),
  )

  return factory.createMethodDeclaration(
    [],
    [factory.createModifier(SyntaxKind.PublicKeyword), factory.createModifier(SyntaxKind.AsyncKeyword)],
    undefined,
    accessor.name(data.operation, 'operation'),
    undefined,
    [],
    getApiMethodParameterAsts(data, context),
    getApiMethodReturnTypeAst(data, context),
    factory.createBlock([returnStatement]),
  )
}
