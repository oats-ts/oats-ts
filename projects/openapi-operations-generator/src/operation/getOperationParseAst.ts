import { CallExpression, factory } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
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
