import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { getNamedTypeAst } from './getNamedTypeAst'
import { TypesGeneratorConfig, TypesGeneratorContext } from './typings'
import { getTypeImports } from './getTypeImports'

export function generateType(
  schema: Referenceable<SchemaObject>,
  context: TypesGeneratorContext,
  config: TypesGeneratorConfig,
): TypeScriptModule {
  const { pathOf, target } = context
  const path = pathOf(schema, target)
  return {
    path,
    content: [getNamedTypeAst(schema, context, config)],
    dependencies: getTypeImports(path, schema, context, false),
  }
}
