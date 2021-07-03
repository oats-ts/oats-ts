import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation, getResponseSchemas } from '@oats-ts/openapi-common'
import { getResponseParserHintAst } from './getResponseParserHintAst'
import { getNamedImports } from '@oats-ts/typescript-common'
import { values, flatMap } from 'lodash'
import { OperationsGeneratorConfig } from '../typings'

export function generateResponseParserHint(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): TypeScriptModule {
  const { accessor } = context
  const path = accessor.path(data.operation, 'operation-response-parser-hint')
  const dependencies = [getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.ResponseExpectations])]
  if (config.validate) {
    const schemas = values(getResponseSchemas(data.operation, context))
    dependencies.push(...flatMap(schemas, (schema) => accessor.dependencies(path, schema, 'validator')))
  }
  return {
    path,
    dependencies,
    content: [getResponseParserHintAst(data, context, config)],
  }
}
