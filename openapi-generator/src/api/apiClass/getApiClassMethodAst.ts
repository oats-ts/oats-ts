import { factory, MethodDeclaration } from 'typescript'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../../operations/typings'
import { getApiMethodParameterAsts } from './getApiMethodParameterAsts'
import { getApiMethodReturnTypeAst } from './getApiMethodReturnTypeAst'
import { tsAsyncModifier, tsPublicModifier } from '../../common/typeScriptUtils'

export function getApiClassMethodAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): MethodDeclaration {
  const { accessor } = context

  const returnStatement = factory.createReturnStatement(
    factory.createCallExpression(
      factory.createIdentifier(accessor.name(data.operation, 'operation')),
      [],
      [
        factory.createIdentifier('input'),
        factory.createObjectLiteralExpression([
          factory.createSpreadAssignment(
            factory.createPropertyAccessExpression(factory.createIdentifier('this'), 'config'),
          ),
          factory.createSpreadAssignment(factory.createIdentifier('config')),
        ]),
      ],
    ),
  )

  return factory.createMethodDeclaration(
    [],
    [tsPublicModifier(), tsAsyncModifier()],
    undefined,
    accessor.name(data.operation, 'operation'),
    undefined,
    [],
    getApiMethodParameterAsts(data, context), // TODO parameters
    getApiMethodReturnTypeAst(data, context), // TODO type
    factory.createBlock([returnStatement]),
  )
}
