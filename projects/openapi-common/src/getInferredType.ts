import { InferredType } from './typings'
import { isNil } from 'lodash'
import { ReferenceObject, SchemaObject, isReferenceObject } from '@oats-ts/json-schema-model'

export function getInferredType(data: SchemaObject | ReferenceObject): InferredType {
  if (isNil(data)) {
    return undefined
  }

  if (isReferenceObject(data)) {
    return 'ref'
  }

  if (!isNil(data.oneOf)) {
    return 'union'
  }

  if (!isNil(data.allOf)) {
    return 'intersection'
  }

  if (!isNil(data.enum)) {
    return 'enum'
  }

  if (data.type === 'string') {
    return 'string'
  }

  if (data.type === 'number' || data.type === 'integer') {
    return 'number'
  }

  if (data.type === 'boolean') {
    return 'boolean'
  }

  if (!isNil(data.additionalProperties)) {
    return 'record'
  }

  if (!isNil(data.properties) || data.type === 'object') {
    return 'object'
  }

  if (!isNil(data.items) || data.type === 'array') {
    return 'array'
  }

  return 'unknown'
}
