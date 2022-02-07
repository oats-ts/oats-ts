import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { getNamedTypeAst } from './getNamedTypeAst'
import { TypesGeneratorConfig } from './typings'
import { getTypeImports } from './getTypeImports'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function generateType(
  schema: Referenceable<SchemaObject>,
  context: JsonSchemaGeneratorContext,
  config: TypesGeneratorConfig,
): TypeScriptModule {
  const { pathOf } = context
  const path = pathOf(schema, 'json-schema/type')
  return {
    path,
    content: [getNamedTypeAst(schema, context, config)],
    dependencies: getTypeImports(path, schema, context, false),
  }
}
