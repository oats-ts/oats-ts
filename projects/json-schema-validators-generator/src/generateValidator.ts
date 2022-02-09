import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { getValidatorAst } from './getValidatorAst'
import { getValidatorImports } from './getValidatorImports'
import { ValidatorsGeneratorConfig } from './typings'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function generateValidator(
  schema: SchemaObject | ReferenceObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
): TypeScriptModule {
  const { pathOf } = context
  const path = pathOf(schema, 'json-schema/type-validator')
  return {
    path,
    dependencies: getValidatorImports(path, schema, context, config),
    content: [getValidatorAst(schema, context, config)],
  }
}
