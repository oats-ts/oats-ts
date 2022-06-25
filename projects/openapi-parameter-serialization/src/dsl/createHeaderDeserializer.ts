import { entries } from '../utils'
import { Deserializer, DslConfig, HeaderDslRoot, ParameterType, ParameterValue, RawHeaders } from './types'
import { headerSimpleArray } from '../deserializers/header/headerSimpleArray'
import { headerSimpleObject } from '../deserializers/header/headerSimpleObject'
import { headerSimplePrimitive } from '../deserializers/header/headerSimplePrimitive'
import { pathLabelArray } from '../deserializers/path/pathLabelArray'
import { pathLabelObject } from '../deserializers/path/pathLabelObject'
import { pathLabelPrimitive } from '../deserializers/path/pathLabelPrimitive'
import { pathMatrixArray } from '../deserializers/path/pathMatrixArray'
import { pathMatrixObject } from '../deserializers/path/pathMatrixObject'
import { pathMatrixPrimitive } from '../deserializers/path/pathMatrixPrimitive'
import { pathSimpleArray } from '../deserializers/path/pathSimpleArray'
import { pathSimpleObject } from '../deserializers/path/pathSimpleObject'
import { pathSimplePrimitive } from '../deserializers/path/pathSimplePrimitive'
import { queryDeepObjectObject } from '../deserializers/query/queryDeepObjectObject'
import { queryFormArray } from '../deserializers/query/queryFormArray'
import { queryFormObject } from '../deserializers/query/queryFormObject'
import { queryFormPrimitive } from '../deserializers/query/queryFormPrimitive'
import { queryPipeDelimitedArray } from '../deserializers/query/queryPipeDelimitedArray'
import { querySpaceDelimitedArray } from '../deserializers/query/querySpaceDelimitedArray'
import { HeaderOptions } from '../deserializers/types'
import { booleanParser } from '../deserializers/value/booleanParser'
import { stringParser } from '../deserializers/value/stringParser'
import { numberParser } from '../deserializers/value/numberParser'
import { optionalParser } from '../deserializers/value/optionalParser'
import { enumerationParser } from '../deserializers/value/enumerationParser'
import { literalParser } from '../deserializers/value/literalParser'
import { createValueDeserializer } from './createValueDeserializer'
import { createPropertyValueDeserializers } from './createPropertyValueDeserializers'
import { unexpectedStyle, unexpectedType } from './errors'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { fromRecord, Try } from '@oats-ts/try'

export function createHeaderDeserializesr<T extends ParameterType>(root: HeaderDslRoot<T>) {
  const deserializers = entries(root).reduce((obj, [key, dsl]) => {
    const options: DslConfig = { explode: dsl.explode, required: dsl.required }
    const { style, type } = dsl
    switch (style) {
      case 'simple': {
        switch (type) {
          case 'primitive': {
            obj[key] = headerSimplePrimitive(createValueDeserializer(dsl.value), options)
            return obj
          }
          case 'array': {
            obj[key] = headerSimpleArray(createValueDeserializer(dsl.items), options)
            return obj
          }
          case 'object': {
            obj[key] = headerSimpleObject(createPropertyValueDeserializers(dsl.properties), options)
            return obj
          }
          default: {
            throw unexpectedType(type)
          }
        }
      }
      default: {
        throw unexpectedStyle(style, ['simple'])
      }
    }
  }, {} as Record<string, Deserializer<RawHeaders, any>>)

  return function headerDeserializer(
    input: RawHeaders,
    path: string = 'headers',
    config: ValidatorConfig = DefaultConfig,
  ): Try<T> {
    const deserialized = Object.keys(deserializers).reduce((acc: Record<string, Try<ParameterValue>>, key: string) => {
      const deserializer = deserializers[key]
      acc[key] = deserializer(input, key, config.append(path, key), config)
      return acc
    }, {})
    return fromRecord(deserialized) as Try<T>
  }
}
