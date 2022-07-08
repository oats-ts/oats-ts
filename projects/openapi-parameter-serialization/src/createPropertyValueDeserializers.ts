import { entries } from './utils'
import { createValueDeserializer } from './createValueDeserializer'
import { FieldValueDeserializers, PrimitiveRecord, PropertiesDsl } from './types'

export function createPropertyValueDeserializers<T extends PrimitiveRecord>(
  dsl: PropertiesDsl,
): FieldValueDeserializers<T> {
  return entries(dsl).reduce((obj, [key, valueDsl]): FieldValueDeserializers<T> => {
    obj[key as keyof T] = createValueDeserializer(valueDsl)
    return obj
  }, {} as FieldValueDeserializers<T>)
}
