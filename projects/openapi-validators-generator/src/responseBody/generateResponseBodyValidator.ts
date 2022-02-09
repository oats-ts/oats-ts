import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation, getEnhancedResponses } from '@oats-ts/openapi-common'
import { getResponseBodyValidatorAst } from './getResponseBodyValidatorAst'
import { flatMap } from 'lodash'

export function generateResponseBodyValidator(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  const { pathOf, dependenciesOf } = context
  const path = pathOf(data.operation, 'openapi/response-body-validator')
  const responses = getEnhancedResponses(data.operation, context)
  const dependencies = [...flatMap(responses, ({ schema }) => dependenciesOf(path, schema, 'json-schema/type-validator'))]
  return {
    path,
    dependencies,
    content: [getResponseBodyValidatorAst(data, context)],
  }
}
