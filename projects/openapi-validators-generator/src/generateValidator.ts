import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getValidatorAst } from './getValidatorAst'
import { getValidatorImports } from './getValidatorImports'
import { ValidatorsGeneratorConfig } from './typings'

export function generateValidator(
  schema: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
): TypeScriptModule {
  const { accessor } = context
  const path = accessor.path(schema, 'validator')
  return {
    path,
    dependencies: getValidatorImports(schema, context, config),
    content: [getValidatorAst(schema, context, config)],
  }
}
