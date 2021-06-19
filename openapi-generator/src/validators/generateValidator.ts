import { BabelModule } from '@oats-ts/babel-writer'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import { getValidatorAst } from './getValidatorAst'
import { getValidatorImports } from './getValidatorImports'

export function generateValidator(schema: SchemaObject, context: OpenAPIGeneratorContext): BabelModule {
  const { accessor } = context
  const path = accessor.path(schema, 'validator')
  return {
    statements: [getValidatorAst(schema, context)],
    path,
    imports: [getValidatorImports(schema, context)],
  }
}
