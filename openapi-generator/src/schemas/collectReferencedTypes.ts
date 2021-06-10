import { entries, isNil } from 'lodash'
import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'

function collectInChildren(input: SchemaObject, context: OpenAPIGeneratorContext, schemas: SchemaObject[]) {
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

function collect(
  input: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  schemas: SchemaObject[],
): void {
  const { accessor } = context
  const schema = accessor.dereference(input)
  if (!isNil(accessor.name(schema, 'type'))) {
    schemas.push(schema)
  } else {
    collectInChildren(schema, context, schemas)
  }
}

export function collectReferencedNamedSchemas(schema: SchemaObject, context: OpenAPIGeneratorContext): SchemaObject[] {
  const schemas: SchemaObject[] = []
  collectInChildren(schema, context, schemas)
  return schemas
}
