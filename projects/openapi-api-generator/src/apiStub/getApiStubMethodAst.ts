import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getApiMethodParameterAsts } from '../apiClass/getApiMethodParameterAsts'
import { getApiMethodReturnTypeAst } from '../apiClass/getApiMethodReturnTypeAst'
import { factory, MethodDeclaration, SyntaxKind } from 'typescript'

export function getApiStubMethodAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): MethodDeclaration {
  const { nameOf } = context

  const name = nameOf(data.operation, 'openapi/operation')

  const throwStatement = factory.createThrowStatement(
    factory.createNewExpression(
      factory.createIdentifier('Error'),
      [],
      [factory.createStringLiteral(`"${name}" is not implemented`)],
    ),
  )

  return factory.createMethodDeclaration(
    [],
    [factory.createModifier(SyntaxKind.PublicKeyword), factory.createModifier(SyntaxKind.AsyncKeyword)],
    undefined,
    name,
    undefined,
    [],
    getApiMethodParameterAsts(data, context, true),
    getApiMethodReturnTypeAst(data, context),
    factory.createBlock([throwStatement]),
  )
}
