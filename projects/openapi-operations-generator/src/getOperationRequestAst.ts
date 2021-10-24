import { Expression, factory } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { OperationsGeneratorConfig } from './typings'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { getOperationRequestLiteralAst } from './getOperationRequestLiteralAst'

export function getOperationExecuteAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): Expression {
  const { nameOf } = context
  return factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.HttpClient.execute),
    [],
    [
      getOperationRequestLiteralAst(data, context),
      factory.createIdentifier('config'),
      ...(config.validate ? [factory.createIdentifier(nameOf(data.operation, 'openapi/response-body-validator'))] : []),
    ],
  )
}
