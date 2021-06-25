import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { SchemaObject } from 'openapi3-ts'
import { getReferencedNamedSchemas } from '../common/getReferencedNamedSchemas'
import { OpenAPIGeneratorContext } from '../typings'
import { getNamedTypeAst } from './getNamedTypeAst'
import { tsModelImportAsts } from '../common/typeScriptUtils'
import { TypesGeneratorConfig } from './typings'

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
    dependencies: tsModelImportAsts(path, 'type', referencedTypes, context),
  }
}
