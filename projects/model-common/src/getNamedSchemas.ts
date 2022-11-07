import { isNil, values } from 'lodash'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { HasSchemas } from './types'
import { isReferenceObject } from './isReferenceObject'
import { GeneratorContext } from '@oats-ts/oats-ts'

/* TODO prevent recursion */
function collectNamedTypesForSchema(
  input: SchemaObject | ReferenceObject,
  context: GeneratorContext,
  schemas: Set<SchemaObject | ReferenceObject>,
  processed: Set<SchemaObject | ReferenceObject>,
) {
  if (isNil(input) || processed.has(input) || schemas.has(input)) {
    return
  }
  const schema = isReferenceObject(input) ? context.dereference<SchemaObject>(input) : input

  if (processed.has(schema) || schemas.has(schema)) {
    return
  }

  if (!isNil(context.nameOf(schema))) {
    schemas.add(schema)
  }

  const { additionalProperties, items, oneOf, properties, prefixItems, allOf } = schema

  if (!isNil(additionalProperties) && typeof additionalProperties === 'object') {
    collectNamedTypesForSchema(additionalProperties, context, schemas, processed)
  }

  if (!isNil(items) && typeof items === 'object') {
    collectNamedTypesForSchema(items, context, schemas, processed)
  }

  if (!isNil(properties)) {
    for (const propertySchema of values(properties)) {
      collectNamedTypesForSchema(propertySchema, context, schemas, processed)
    }
  }

  if (Array.isArray(prefixItems)) {
    for (const prefixSchema of prefixItems) {
      collectNamedTypesForSchema(prefixSchema, context, schemas, processed)
    }
  }

  if (Array.isArray(oneOf)) {
    for (const oneOfSchema of oneOf) {
      collectNamedTypesForSchema(oneOfSchema, context, schemas, processed)
    }
  }

  if (Array.isArray(allOf)) {
    for (const allOfSchema of allOf) {
      collectNamedTypesForSchema(allOfSchema, context, schemas, processed)
    }
  }

  processed.add(input)

  if (!isNil(context.nameOf(input))) {
    schemas.add(input)
  }
}

export function getNamedSchemas<D extends HasSchemas>(
  context: GeneratorContext<D>,
): (SchemaObject | ReferenceObject)[] {
  const schemaSet = new Set<SchemaObject | ReferenceObject>()

  const processed = new Set<SchemaObject | ReferenceObject>()
  const rawSchemas = values(context.document()?.components?.schemas || {})

  for (const schema of rawSchemas) {
    collectNamedTypesForSchema(schema, context, schemaSet, processed)
  }

  return Array.from(schemaSet)
}
