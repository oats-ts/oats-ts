import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { getValidatorAst } from './getValidatorAst'
import { getValidatorImports } from './getValidatorImports'
import { ValidatorsGeneratorConfig, ValidatorsGeneratorContext } from './typings'

export function generateValidator(
  schema: SchemaObject | ReferenceObject,
  context: ValidatorsGeneratorContext,
  config: ValidatorsGeneratorConfig,
): TypeScriptModule {
  const { pathOf } = context
  const path = pathOf(schema, context.produces)
  return {
    path,
    dependencies: getValidatorImports(path, schema, context, config),
    content: [getValidatorAst(schema, context, config)],
  }
}
