import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { entries } from 'lodash'

export const numberSchema: SchemaObject = {
  type: 'number',
}

export const stringSchema: SchemaObject = {
  type: 'string',
}

export const booleanSchema: SchemaObject = {
  type: 'boolean',
}

export const enumSchema: SchemaObject = {
  type: 'string',
  enum: ['A', 'B', 'C'],
}

export function arraySchema(items: Referenceable<SchemaObject>): SchemaObject {
  return {
    type: 'array',
    items,
  }
}

export function referenceOf(schema: SchemaObject, registry: Record<string, () => SchemaObject>): ReferenceObject {
  for (const [name, provider] of entries(registry)) {
    if (provider() === schema) {
      return { $ref: `#/components/schemas/${name}` }
    }
  }
  throw new TypeError(`Non-referenceable schema ${schema}`)
}
