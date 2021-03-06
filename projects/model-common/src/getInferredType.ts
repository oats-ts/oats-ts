import { isNil } from 'lodash'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { InferredType } from './types'
import { isReferenceObject } from './isReferenceObject'

export function getInferredType(data: SchemaObject | ReferenceObject): InferredType {
  if (isNil(data)) {
    return 'unknown'
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

  if (Object.prototype.hasOwnProperty.call(data, 'const')) {
    return 'literal'
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

  if (!isNil(data.prefixItems)) {
    return 'tuple'
  }

  if ((!isNil(data.items) || data.type === 'array') && typeof data.items !== 'boolean') {
    return 'array'
  }

  return 'unknown'
}
