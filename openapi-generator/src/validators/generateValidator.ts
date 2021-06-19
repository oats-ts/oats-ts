import { BabelModule } from '@oats-ts/babel-writer'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import { getValidatorAst } from './getValidatorAst'
import { getValidatorImports } from './getValidatorImports'

export function generateValidator(
  schema: SchemaObject,
  context: OpenAPIGeneratorContext,
  references: boolean,
): BabelModule {
  const { accessor } = context
  const path = accessor.path(schema, 'validator')
  return {
    statements: [getValidatorAst(schema, context, references)],
    path,
    imports: getValidatorImports(schema, context, references),
  }
}