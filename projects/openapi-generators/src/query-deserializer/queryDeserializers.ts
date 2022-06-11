import { QueryDeserializersGenerator } from './QueryDeserializersGenerator'

export function queryDeserializers(): QueryDeserializersGenerator {
  return new QueryDeserializersGenerator()
}
