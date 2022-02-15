import { SchemaObject, ReferenceObject } from '@oats-ts/json-schema-model'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getTypeGuardFunctionAst } from './getTypeGuardFunctionAst'
import { TypeGuardGeneratorConfig } from './typings'
import { factory } from 'typescript'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { getTypeGuardImports } from './getTypeGuardImports'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function generateTypeGuard(
  schema: SchemaObject | ReferenceObject,
  context: JsonSchemaGeneratorContext,
  config: TypeGuardGeneratorConfig,
): TypeScriptModule {
  const { pathOf, dependenciesOf } = context
  const path = pathOf(schema, 'json-schema/type-guard')
  const typeImports = dependenciesOf(path, schema, 'json-schema/type')
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
