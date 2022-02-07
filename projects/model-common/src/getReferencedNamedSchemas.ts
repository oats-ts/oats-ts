import { entries, isNil } from 'lodash'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { GeneratorContext } from './types'
import { isReferenceObject } from './isReferenceObject'

function collectInChildren(input: SchemaObject, context: GeneratorContext, schemas: SchemaObject[]) {
  const { items, additionalProperties, properties, oneOf } = input

  if (!isNil(items)) {
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

function collect(input: SchemaObject | ReferenceObject, context: GeneratorContext, schemas: SchemaObject[]): void {
  const { dereference, nameOf } = context
  const schema = dereference(input)
  if (!isNil(nameOf(schema, 'json-schema/type'))) {
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
  schema: SchemaObject | ReferenceObject,
  context: GeneratorContext,
): SchemaObject[] {
  const schemas: SchemaObject[] = []
  if (isReferenceObject(schema)) {
    collect(schema, context, schemas)
  } else {
    collectInChildren(schema, context, schemas)
  }
  return schemas
}
