import { SchemaObject, ReferenceObject } from '@oats-ts/json-schema-model'
import { isReferenceObject } from '@oats-ts/json-schema-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getTypeGuardFunctionAst } from './getTypeGuardFunctionAst'
import { TypeGuardGeneratorConfig, TypeGuardGeneratorContext, UnionTypeGuardGeneratorConfig } from './typings'
import { getDiscriminators } from '@oats-ts/model-common'
import { isNil, keys } from 'lodash'
import { factory } from 'typescript'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { getDiscriminatorBasedTypeAssertionAst } from './getDiscriminatorBasedTypeAssertionAst'
import { getTypeGuardImports } from './getTypeGuardImports'

function isUnionTypeGuardGeneratorConfig(input: any): input is UnionTypeGuardGeneratorConfig {
  return typeof input === 'object' && input !== null && input.discriminatorBased === true
}

export function generateTypeGuard(
  schema: SchemaObject | ReferenceObject,
  context: TypeGuardGeneratorContext,
  config: TypeGuardGeneratorConfig,
): TypeScriptModule {
  const { pathOf, dependenciesOf } = context
  const path = pathOf(schema, context.produces)
  const typeImports = dependenciesOf(path, schema, context.produces)
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
