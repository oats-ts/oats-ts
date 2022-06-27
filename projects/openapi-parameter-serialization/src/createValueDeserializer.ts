import { isNil } from './common/utils'
import { Primitive, ValueDeserializer, ValueDsl } from './types'
import { booleanParser } from './deserializers/value/booleanParser'
import { stringParser } from './deserializers/value/stringParser'
import { numberParser } from './deserializers/value/numberParser'
import { optionalParser } from './deserializers/value/optionalParser'
import { enumerationParser } from './deserializers/value/enumerationParser'
import { literalParser } from './deserializers/value/literalParser'

export function createValueDeserializer<I extends Primitive = Primitive, O extends Primitive = Primitive>(
  dsl: ValueDsl,
): ValueDeserializer<I, O> {
  const type = dsl.type
  switch (dsl.type) {
    case 'boolean': {
      const deserializer = isNil(dsl.dsl) ? booleanParser() : booleanParser(createValueDeserializer<boolean>(dsl.dsl))
      return deserializer as ValueDeserializer<I, O>
    }
    case 'string': {
      const deserializer = isNil(dsl.dsl) ? stringParser() : stringParser(createValueDeserializer<string>(dsl.dsl))
      return deserializer as ValueDeserializer<I, O>
    }
    case 'number': {
      const deserializer = isNil(dsl.dsl) ? numberParser() : numberParser(createValueDeserializer<number>(dsl.dsl))
      return deserializer as ValueDeserializer<I, O>
    }
    case 'optional': {
      const deserializer = optionalParser(createValueDeserializer(dsl.dsl))
      return deserializer as ValueDeserializer<I, O>
    }
    case 'enum': {
      const deserializer = enumerationParser(dsl.values)
      return deserializer as ValueDeserializer<I, O>
    }
    case 'literal': {
      const deserializer = literalParser(dsl.value)
      return deserializer as ValueDeserializer<I, O>
    }
    default: {
      throw new TypeError(`Unexpected value parser of type "${type}" `)
    }
  }
}
