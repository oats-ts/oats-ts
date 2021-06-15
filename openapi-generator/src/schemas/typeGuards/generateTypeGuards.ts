import { SchemaObject } from 'openapi3-ts'
import { BabelModule } from '@oats-ts/babel-writer'
import { OpenAPIGeneratorContext } from '../../typings'
import { getTypeGuardFunctionAst } from './getTypeGuardFunctionAst'
import { TypeGuardGeneratorConfig } from './typings'
import { getDiscriminators } from '../../common/getDiscriminators'
import { keys } from 'lodash'
import { getShallowTypeAssertionAst } from './getShallowTypeAssertionAst'
import { getUnionTypeAssertionAst } from './getUnionTypeAssertionAst'

export function generateTypeGuard(
  schema: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: TypeGuardGeneratorConfig,
): BabelModule {
  const { accessor } = context
  const path = accessor.path(schema, 'type-guard')
  switch (config.mode) {
    case 'shallow': {
      return {
        statements: [getTypeGuardFunctionAst(schema, context, getShallowTypeAssertionAst(schema, context))],
        path,
        imports: [],
      }
    }
    case 'union': {
      const discriminators = getDiscriminators(schema, context)
      if (keys(discriminators).length === 0) {
        return undefined
      }
      return {
        statements: [
          getTypeGuardFunctionAst(schema, context, getUnionTypeAssertionAst(schema, discriminators, context)),
        ],
        path,
        imports: [],
      }
    }
  }
  return undefined
}
