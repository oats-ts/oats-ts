import { SchemaObject } from 'openapi3-ts'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getTypeGuardFunctionAst } from './getTypeGuardFunctionAst'
import { TypeGuardGeneratorConfig, UnionTypeGuardGeneratorConfig } from './typings'
import { getDiscriminators } from '@oats-ts/openapi-common'
import { isNil, keys } from 'lodash'
import { factory } from 'typescript'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { getDiscriminatorBasedTypeAssertionAst } from './getDiscriminatorBasedTypeAssertionAst'
import { getTypeGuardImports } from './getTypeGuardImports'

function isUnionTypeGuardGeneratorConfig(input: any): input is UnionTypeGuardGeneratorConfig {
  return typeof input === 'object' && input !== null && input.discriminatorBased === true
}

export function generateTypeGuard(
  schema: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: TypeGuardGeneratorConfig,
): TypeScriptModule {
  const { accessor } = context
  const path = accessor.path(schema, 'openapi/type-guard')
  const typeImports = accessor.dependencies(path, schema, 'openapi/type')
  if (isUnionTypeGuardGeneratorConfig(config)) {
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
        getTypeAssertionAst(schema, context, factory.createIdentifier('input'), config),
      ),
    ],
  }
}
