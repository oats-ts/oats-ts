import { InferredType } from './typings'
import { isNil } from 'lodash'
import { SchemaObject } from 'openapi3-ts'

export function getInferredType(data: SchemaObject): InferredType {
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
