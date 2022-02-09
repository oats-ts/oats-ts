import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { isReferenceObject } from '@oats-ts/model-common'
import { isNil, last } from 'lodash'
import { SchemaType } from './typings'
import {
  booleanArraySchema,
  registry,
  enumArraySchema,
  enumSchema,
  numberArraySchema,
  objectSchema,
  objectSchemaExpl,
  optObjectSchema,
  optObjectSchemaExpl,
  stringArraySchema,
} from './schema'
import { camelCase } from '../common/camelCase'
import { booleanSchema, numberSchema, stringSchema } from '../common/schema'

export function getFieldName(
  schema: Referenceable<SchemaObject>,
  optional: boolean,
  isField: boolean = false,
  prefix: string = '',
): string {
  if (isReferenceObject(schema)) {
    const { $ref } = schema
    const name = last($ref.split('/')) as string
    const provider = registry[name]
    if (isNil(provider)) {
      throw new TypeError(`Invalid reference ${$ref}`)
    }
    return getFieldName(provider(), optional, isField)
  }
  switch (schema.type) {
    case 'string':
      if (schema.enum) {
        return camelCase(prefix, optional ? 'opt' : '', 'enm', isField ? 'field' : '')
      }
      return camelCase(prefix, optional ? 'opt' : '', 'str', isField ? 'field' : '')
    case 'number':
      return camelCase(prefix, optional ? 'opt' : '', 'num', isField ? 'field' : '')
    case 'boolean':
      return camelCase(prefix, optional ? 'opt' : '', 'bool', isField ? 'field' : '')
    case 'array':
      return camelCase(
        prefix,
        optional ? 'opt' : '',
        getFieldName(schema.items as Referenceable<SchemaObject>, false),
        'arr',
        isField ? 'field' : '',
      )
    case 'object':
      return camelCase(prefix, optional ? 'opt' : '', 'obj', isField ? 'field' : '')
    default:
      throw new TypeError(`Invalid input ${JSON.stringify(schema)}`)
  }
}

export function getSchema(type: SchemaType, required: boolean, explode: boolean): Referenceable<SchemaObject> {
  switch (type) {
    case 'string':
      return stringSchema
    case 'number':
      return numberSchema
    case 'boolean':
      return booleanSchema
    case 'enum':
      return enumSchema
    case 'string-array':
      return stringArraySchema
    case 'number-array':
      return numberArraySchema
    case 'boolean-array':
      return booleanArraySchema
    case 'enum-array':
      return enumArraySchema
    case 'object': {
      if (required) {
        return explode ? objectSchemaExpl : objectSchema
      } else {
        return explode ? optObjectSchemaExpl : optObjectSchema
      }
    }
  }
}
