import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getSdkMethodParameterAsts } from '../implementation/getSdkMethodParameterAsts'
import { getApiMethodReturnTypeAst } from '../implementation/getSdkMethodReturnTypeAst'
import { factory, MethodDeclaration, SyntaxKind } from 'typescript'

export function getSdkStubMethodAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): MethodDeclaration {
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
    getSdkMethodParameterAsts(data, context, true),
    getApiMethodReturnTypeAst(data, context),
    factory.createBlock([throwStatement]),
  )
}
