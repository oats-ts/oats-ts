import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation, getEnhancedResponses } from '@oats-ts/openapi-common'
import { getExpectationsAst } from './getExpectationsAst'
import { getNamedImports } from '@oats-ts/typescript-common'
import { flatMap } from 'lodash'
import { OperationsGeneratorConfig } from '../typings'

export function generateResponseParserHint(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): TypeScriptModule {
  const { pathOf, dependenciesOf } = context
  const path = pathOf(data.operation, 'openapi/expectations')
  const dependencies = [getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.ResponseExpectations])]
  if (config.validate) {
    const responses = getEnhancedResponses(data.operation, context)
    dependencies.push(...flatMap(responses, ({ schema }) => dependenciesOf(path, schema, 'openapi/validator')))
  }
  return {
    path,
    dependencies,
    content: [getExpectationsAst(data, context, config)],
  }
}
