import { BabelModule } from '@oats-ts/babel-writer'
import { SchemaObject } from 'openapi3-ts'
import { getReferencedNamedSchemas } from '../common/getReferencedNamedSchemas'
import { getImportDeclarations } from '../common/getImportDeclarations'
import { OpenAPIGeneratorContext } from '../typings'
import { getNamedTypeAst } from './getNamedTypeAst'

export function generateType(schema: SchemaObject, context: OpenAPIGeneratorContext): BabelModule {
  const { accessor } = context
  const path = accessor.path(schema, 'type')
  const referencedTypes = getReferencedNamedSchemas(schema, context)
  return {
    statements: [getNamedTypeAst(schema, context)],
    path,
    imports: getImportDeclarations(path, 'type', referencedTypes, context),
  }
}