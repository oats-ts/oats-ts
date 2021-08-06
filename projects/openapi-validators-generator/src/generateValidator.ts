import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getValidatorAst } from './getValidatorAst'
import { getValidatorImports } from './getValidatorImports'
import { ValidatorsGeneratorConfig } from './typings'

export function generateValidator(
  schema: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
): TypeScriptModule {
  const { pathOf } = context
  const path = pathOf(schema, 'openapi/validator')
  return {
    path,
    dependencies: getValidatorImports(path, schema, context, config),
    content: [getValidatorAst(schema, context, config)],
  }
}
