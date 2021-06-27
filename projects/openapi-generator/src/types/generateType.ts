import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { SchemaObject } from 'openapi3-ts'
import { getReferencedNamedSchemas, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getNamedTypeAst } from './getNamedTypeAst'
import { TypesGeneratorConfig } from './typings'
import { getModelImports } from '@oats-ts/typescript-common'

export function generateType(
  schema: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
): TypeScriptModule {
  const { accessor } = context
  const path = accessor.path(schema, 'type')
  const referencedTypes = getReferencedNamedSchemas(schema, context)
  return {
    path,
    content: [getNamedTypeAst(schema, context, config)],
    dependencies: getModelImports(path, 'type', referencedTypes, context),
  }
}
