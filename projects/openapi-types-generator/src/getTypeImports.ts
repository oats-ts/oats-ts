import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'
import { isNil } from 'lodash'
import { OpenAPIGeneratorContext, getReferencedNamedSchemas } from '@oats-ts/openapi-common'

export function getTypeImports(
  fromPath: string,
  schema: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  referenceOnly: boolean,
): ImportDeclaration[] {
  const { nameOf } = context
  const name = nameOf(schema, 'openapi/type')
  if (referenceOnly && !isNil(name)) {
    return getModelImports(fromPath, 'openapi/type', [schema], context)
  }
  return getModelImports(fromPath, 'openapi/type', getReferencedNamedSchemas(schema, context), context)
}
