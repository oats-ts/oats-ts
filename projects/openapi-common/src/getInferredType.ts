import { isNil } from 'lodash'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { isReferenceObject } from './isReferenceObject'
import { InferredType } from './typings'

export function getInferredType(data: Referenceable<SchemaObject>): InferredType {
  if (isNil(data) || typeof data !== 'object') {
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

  if (!isNil(data.additionalProperties) && data.additionalProperties !== true && data.additionalProperties !== false) {
    return 'record'
  }

  if ((!isNil(data.properties) || data.type === 'object') && data.additionalProperties !== true) {
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
