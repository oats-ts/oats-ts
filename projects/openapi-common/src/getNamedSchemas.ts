import { isNil, values } from 'lodash'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { isReferenceObject } from './isReferenceObject'
import { OpenAPIGeneratorContext } from './typings'

/* TODO prevent recursion */
function collectNamedTypesForSchema(
  input: Referenceable<SchemaObject>,
  context: OpenAPIGeneratorContext,
  schemas: Set<Referenceable<SchemaObject>>,
  processed: Set<Referenceable<SchemaObject>>,
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

export function getNamedSchemas(context: OpenAPIGeneratorContext): Referenceable<SchemaObject>[] {
  const schemaSet = new Set<Referenceable<SchemaObject>>()

  const processed = new Set<Referenceable<SchemaObject>>()
  const rawSchemas = values(context.document()?.components?.schemas || {})

  for (const schema of rawSchemas) {
    collectNamedTypesForSchema(schema, context, schemaSet, processed)
  }

  return Array.from(schemaSet)
}
