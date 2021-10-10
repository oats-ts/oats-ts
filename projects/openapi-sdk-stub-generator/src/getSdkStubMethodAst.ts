import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getSdkMethodParameterAsts } from './getSdkMethodParameterAsts'
import { factory, MethodDeclaration, SyntaxKind } from 'typescript'

export function getSdkStubMethodAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): MethodDeclaration {
  const { nameOf } = context

  const name = nameOf(data.operation, 'openapi/operation')

  const throwStatement = factory.createThrowStatement(
    factory.createNewExpression(
      factory.createIdentifier('Error'),
      [],
      [
        factory.createStringLiteral(
          `Stub method "${name}" called. You should implement this method if you want to use it.`,
        ),
      ],
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
    factory.createTypeReferenceNode('Promise', [
      factory.createTypeReferenceNode(nameOf(data.operation, 'openapi/response-type')),
    ]),
    factory.createBlock([throwStatement]),
  )
}
