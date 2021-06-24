import { TypeScriptModule } from '@oats-ts/babel-writer'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
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
    statements: [getValidatorAst(schema, context, config)],
    path,
    imports: getValidatorImports(schema, context, config),
  }
}
