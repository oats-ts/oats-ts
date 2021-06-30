import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getNamedTypeAst } from './getNamedTypeAst'
import { TypesGeneratorConfig } from './typings'
import { getTypeImports } from './getTypeImports'

export function generateType(
  schema: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
): TypeScriptModule {
  const { accessor } = context
  const path = accessor.path(schema, 'type')
  return {
    path,
    content: [getNamedTypeAst(schema, context, config)],
    dependencies: getTypeImports(path, schema, context, false),
  }
}
