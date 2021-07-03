import { entries } from 'lodash'
import { Expression, factory, PropertyAssignment, SpreadAssignment } from 'typescript'
import { OpenAPIGeneratorContext, getRequestBodyContent } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getUrlAst } from './getUrlAst'
import { OperationsGeneratorConfig } from '../typings'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { getOperationRequestLiteralAst } from './getOperationRequestLiteralAst'

export function getOperationExecuteAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): Expression {
  const { accessor } = context
  return factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Http.execute),
    [],
    [
      getOperationRequestLiteralAst(data, context),
      factory.createIdentifier('config'),
      ...(config.validate
        ? [factory.createIdentifier(accessor.name(data.operation, 'operation-response-parser-hint'))]
        : []),
    ],
  )
}
