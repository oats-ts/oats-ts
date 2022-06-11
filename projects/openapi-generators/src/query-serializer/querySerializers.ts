import { QuerySerializersGenerator } from './QuerySerializersGenerator'

export function querySerializers(): QuerySerializersGenerator {
  return new QuerySerializersGenerator()
}
