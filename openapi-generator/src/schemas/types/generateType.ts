import { BabelModule } from '@oats-ts/babel-writer'
import { SchemaObject } from 'openapi3-ts'
import { getReferencedNamedSchemas } from '../../common/getReferencedNamedSchemas'
import { createImportDeclarations } from '../../common/getImportDeclarations'
import { OpenAPIGeneratorContext } from '../../typings'
import { getNamedTypeAst } from './getNamedTypeAst'

export function generateType(schema: SchemaObject, context: OpenAPIGeneratorContext): BabelModule {
  const { accessor } = context
  const statement = getNamedTypeAst(schema, context)
  const path = accessor.path(schema, 'type')
  const referencedTypes = getReferencedNamedSchemas(schema, context)
  return {
    statements: [statement],
    path,
    imports: createImportDeclarations(path, 'type', referencedTypes, context),
  }
}
