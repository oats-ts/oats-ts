import { SchemaObject } from 'openapi3-ts'
import { TypeScriptModule } from '@oats-ts/babel-writer'
import { OpenAPIGeneratorContext } from '../typings'
import { getTypeGuardFunctionAst } from './getTypeGuardFunctionAst'
import { TypeGuardGeneratorConfig, UnionTypeGuardGeneratorConfig } from './typings'
import { getDiscriminators } from '../common/getDiscriminators'
import { isNil, keys } from 'lodash'
import { factory } from 'typescript'
import { tsModelImportAsts } from '../common/typeScriptUtils'
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
  const path = accessor.path(schema, 'type-guard')
  const typeImports = tsModelImportAsts(path, 'type', [schema], context)
  if (isUnionTypeGuardGeneratorConfig(config)) {
    const discriminators = getDiscriminators(schema, context)
    if (keys(discriminators).length === 0 || (!isNil(schema.oneOf) && schema.oneOf.length > 0)) {
      return undefined
    }
    return {
      statements: [getTypeGuardFunctionAst(schema, context, getDiscriminatorBasedTypeAssertionAst(schema, context))],
      path,
      imports: [...typeImports],
    }
  }
  return {
    statements: [
      getTypeGuardFunctionAst(
        schema,
        context,
        getTypeAssertionAst(schema, context, factory.createIdentifier('input'), config),
      ),
    ],
    path,
    imports: [...typeImports, ...getTypeGuardImports(schema, context, config)],
  }
}
