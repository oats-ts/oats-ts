import { getEnhancedResponses, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getReturnTypeAst } from './getResponseTypeAst'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { flatMap } from 'lodash'

export function generateOperationReturnType(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  const { dependenciesOf, pathOf } = context
  const responses = getEnhancedResponses(data.operation, context)
  const path = pathOf(data.operation, 'openapi/response-type')
  return {
    path,
    dependencies: [
      ...flatMap(responses, ({ schema, statusCode }) => [
        ...dependenciesOf(path, schema, 'json-schema/type'),
        ...dependenciesOf(path, [data.operation, statusCode], 'openapi/response-headers-type'),
      ]),
    ],
    content: [getReturnTypeAst(data, context)],
  }
}
