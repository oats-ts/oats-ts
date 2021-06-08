import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { isNil, values } from '../../../utils'
import { SchemaContext } from './types'

/* TODO prevent recursion */
function collectNamedTypesForSchema(
  input: SchemaObject | ReferenceObject,
  context: SchemaContext,
  schemas: Set<SchemaObject>,
) {
  if (isNil(input)) {
    return
  }

  const schema = isReferenceObject(input) ? context.utils.dereference<SchemaObject>(input) : input

  if (schemas.has(schema)) {
    return
  }

  if (!isNil(context.utils.nameOf(schema))) {
    schemas.add(schema)
  }

  // TODO not, allOf etc will not be needed for generation
  const { additionalProperties, items, oneOf, properties } = schema

  if (typeof additionalProperties !== 'boolean') {
    collectNamedTypesForSchema(additionalProperties, context, schemas)
  }
  collectNamedTypesForSchema(items, context, schemas)

  for (const schema of values(properties || {})) {
    collectNamedTypesForSchema(schema, context, schemas)
  }

  for (const schema of oneOf || []) {
    collectNamedTypesForSchema(schema, context, schemas)
  }
}

export function collectNamedSchemas(context: SchemaContext): SchemaObject[] {
  const schemaSet = new Set<SchemaObject>()

  for (const schema of values(context.document?.components?.schemas || {})) {
    collectNamedTypesForSchema(schema, context, schemaSet)
  }

  return Array.from(schemaSet)
}
