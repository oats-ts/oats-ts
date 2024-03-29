import { entries, isNil } from 'lodash'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { isReferenceObject } from './isReferenceObject'
import { OpenAPIGeneratorContext } from './typings'

function collectInChildren(input: SchemaObject, context: OpenAPIGeneratorContext, schemas: SchemaObject[]) {
  const { items, additionalProperties, properties, oneOf, prefixItems } = input ?? {}
  if (!isNil(prefixItems)) {
    return prefixItems.forEach((item) => collect(item, context, schemas))
  } else if (!isNil(items) && typeof items !== 'boolean') {
    return collect(items, context, schemas)
  } else if (!isNil(properties)) {
    for (const [, propSchema] of entries(properties)) {
      collect(propSchema, context, schemas)
    }
  } else if (!isNil(additionalProperties) && typeof additionalProperties !== 'boolean') {
    collect(additionalProperties, context, schemas)
  } else if (!isNil(oneOf)) {
    for (const alternative of oneOf) {
      collect(alternative, context, schemas)
    }
  }
}

function collect(input: Referenceable<SchemaObject>, context: OpenAPIGeneratorContext, schemas: SchemaObject[]): void {
  const schema = context.dereference(input)
  if (context.hasName(schema)) {
    schemas.push(schema)
  } else {
    if (isReferenceObject(schema)) {
      collect(schema, context, schemas)
    } else {
      collectInChildren(schema, context, schemas)
    }
  }
}

export function getReferencedNamedSchemas(
  schema: Referenceable<SchemaObject>,
  context: OpenAPIGeneratorContext,
): SchemaObject[] {
  const schemas: SchemaObject[] = []
  if (isReferenceObject(schema)) {
    collect(schema, context, schemas)
  } else {
    collectInChildren(schema, context, schemas)
  }
  return schemas
}
