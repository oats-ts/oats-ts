import { CallExpression, factory } from 'typescript'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getOperationRequestAst } from './getOperationRequestAst'

export function getOperationParseAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): CallExpression {
  const { operation } = data
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(factory.createIdentifier('config'), 'parse'),
    [],
    [
      getOperationRequestAst(data, context),
      factory.createIdentifier(context.accessor.name(operation, 'operation-response-parser-hint')),
    ],
  )
}
