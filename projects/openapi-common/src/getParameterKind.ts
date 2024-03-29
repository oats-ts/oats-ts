import { SchemaObject } from '@oats-ts/json-schema-model'
import { getInferredType } from './getInferredType'
import { ParameterKind } from './typings'

export function getParameterKind(schema: SchemaObject): ParameterKind {
  const type = getInferredType(schema)
  switch (type) {
    case 'array':
      return 'array'
    case 'object':
      return 'object'
    case 'number':
    case 'string':
    case 'boolean':
    case 'enum':
      return 'primitive'
    default:
      return 'unknown'
  }
}
