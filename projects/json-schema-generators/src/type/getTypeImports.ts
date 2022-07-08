import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'
import { getReferencedNamedSchemas } from '@oats-ts/model-common'
import { isNil } from 'lodash'
import { JsonSchemaGeneratorContext, JsonSchemaGeneratorTarget } from '../types'

export function getTypeImports(
  fromPath: string,
  schema: Referenceable<SchemaObject>,
  context: JsonSchemaGeneratorContext,
  referenceOnly: boolean,
): ImportDeclaration[] {
  const { nameOf } = context
  const name = nameOf(schema)
  if (referenceOnly && !isNil(name)) {
    return getModelImports<JsonSchemaGeneratorTarget>(fromPath, 'json-schema/type', [schema], context)
  }
  return getModelImports<JsonSchemaGeneratorTarget>(
    fromPath,
    'json-schema/type',
    getReferencedNamedSchemas(schema, context),
    context,
  )
}
