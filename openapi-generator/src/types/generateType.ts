import { TypeScriptModule } from '@oats-ts/babel-writer'
import { SchemaObject } from 'openapi3-ts'
import { getReferencedNamedSchemas } from '../common/getReferencedNamedSchemas'
import { OpenAPIGeneratorContext } from '../typings'
import { getNamedTypeAst } from './getNamedTypeAst'
import { tsModelImportAsts } from '../common/typeScriptUtils'

export function generateType(schema: SchemaObject, context: OpenAPIGeneratorContext): TypeScriptModule {
  const { accessor } = context
  const path = accessor.path(schema, 'type')
  const referencedTypes = getReferencedNamedSchemas(schema, context)
  return {
    statements: [getNamedTypeAst(schema, context)],
    path,
    imports: tsModelImportAsts(path, 'type', referencedTypes, context),
  }
}
