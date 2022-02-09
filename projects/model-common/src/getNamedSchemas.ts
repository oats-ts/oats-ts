import { isNil, values } from 'lodash'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { GeneratorContext, HasSchemas } from './types'
import { isReferenceObject } from './isReferenceObject'

/* TODO prevent recursion */
function collectNamedTypesForSchema(
  input: SchemaObject | ReferenceObject,
  context: GeneratorContext,
  schemas: Set<SchemaObject | ReferenceObject>,
  processed: Set<SchemaObject | ReferenceObject>,
) {
  const { dereference, nameOf } = context
  if (isNil(input) || processed.has(input) || schemas.has(input)) {
    return
  }
  processed.add(input)

  if (!isNil(nameOf(input))) {
    schemas.add(input)
  }

  const schema = isReferenceObject(input) ? dereference<SchemaObject>(input) : input

  if (processed.has(schema) || schemas.has(schema)) {
    return
  }

  if (!isNil(nameOf(schema))) {
    schemas.add(schema)
  }

  // TODO not, allOf etc will not be needed for generation
  const { additionalProperties, items, oneOf, properties } = schema

  if (typeof additionalProperties !== 'boolean') {
    collectNamedTypesForSchema(additionalProperties, context, schemas, processed)
  }
  if (typeof items !== 'boolean') {
    collectNamedTypesForSchema(items, context, schemas, processed)
  }

  for (const schema of values(properties || {})) {
    collectNamedTypesForSchema(schema, context, schemas, processed)
  }

  for (const schema of oneOf || []) {
    collectNamedTypesForSchema(schema, context, schemas, processed)
  }
}

export function getNamedSchemas<D extends HasSchemas>(
  context: GeneratorContext<D>,
): (SchemaObject | ReferenceObject)[] {
  const { document } = context
  const schemaSet = new Set<SchemaObject | ReferenceObject>()

  const processed = new Set<SchemaObject | ReferenceObject>()
  const rawSchemas = values(document?.components?.schemas || {})

  for (const schema of rawSchemas) {
    collectNamedTypesForSchema(schema, context, schemaSet, processed)
  }

  return Array.from(schemaSet)
}
