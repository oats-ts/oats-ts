import { SchemaObject, ReferenceObject } from '@oats-ts/json-schema-model'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getTypeGuardFunctionAst } from './getTypeGuardFunctionAst'
import { TypeGuardGeneratorConfig } from './typings'
import { getDiscriminators, isReferenceObject } from '@oats-ts/model-common'
import { isNil, keys } from 'lodash'
import { factory } from 'typescript'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { getDiscriminatorBasedTypeAssertionAst } from './getDiscriminatorBasedTypeAssertionAst'
import { getTypeGuardImports } from './getTypeGuardImports'
import { isUnionTypeGuardGeneratorConfig } from './utils'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function generateTypeGuard(
  schema: SchemaObject | ReferenceObject,
  context: JsonSchemaGeneratorContext,
  config: TypeGuardGeneratorConfig,
): TypeScriptModule {
  const { pathOf, dependenciesOf } = context
  const path = pathOf(schema, 'json-schema/type-guard')
  const typeImports = dependenciesOf(path, schema, 'json-schema/type')
  if (isUnionTypeGuardGeneratorConfig(config)) {
    if (isReferenceObject(schema)) {
      return undefined
    }
    const discriminators = getDiscriminators(schema, context)
    if (keys(discriminators).length === 0 || (!isNil(schema.oneOf) && schema.oneOf.length > 0)) {
      return undefined
    }
    return {
      path,
      content: [getTypeGuardFunctionAst(schema, context, getDiscriminatorBasedTypeAssertionAst(schema, context))],
      dependencies: [...typeImports],
    }
  }
  return {
    path,
    dependencies: [...typeImports, ...getTypeGuardImports(schema, context, config)],
    content: [
      getTypeGuardFunctionAst(
        schema,
        context,
        getTypeAssertionAst(schema, context, factory.createIdentifier('input'), config, 0),
      ),
    ],
  }
}
