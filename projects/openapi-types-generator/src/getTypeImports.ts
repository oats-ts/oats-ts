import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'
import { isNil } from 'lodash'
import { OpenAPIGeneratorContext, getReferencedNamedSchemas } from '@oats-ts/openapi-common'

export function getTypeImports(
  fromPath: string,
  schemaOrRef: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  referenceOnly: boolean,
): ImportDeclaration[] {
  const { accessor } = context
  const schema = accessor.dereference(schemaOrRef)
  const name = accessor.name(schema, 'openapi/type')
  if (referenceOnly && !isNil(name)) {
    return getModelImports(fromPath, 'openapi/type', [schema], context)
  }
  return getModelImports(fromPath, 'openapi/type', getReferencedNamedSchemas(schema, context), context)
}