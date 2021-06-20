import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../../operations/typings'
import { getApiMethodParameterAsts } from '../apiClass/getApiMethodParameterAsts'
import { getApiMethodReturnTypeAst } from '../apiClass/getApiMethodReturnTypeAst'
import { factory, MethodDeclaration } from 'typescript'
import { tsAsyncModifier, tsPublicModifier } from '../../common/typeScriptUtils'

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
    [tsPublicModifier(), tsAsyncModifier()],
    undefined,
    accessor.name(data.operation, 'operation'),
    undefined,
    [],
    getApiMethodParameterAsts(data, context),
    getApiMethodReturnTypeAst(data, context),
    factory.createBlock([returnStatement]),
  )
}
