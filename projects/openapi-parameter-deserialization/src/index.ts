import { header } from './header'
import { path } from './path'
import { query } from './query'
import { value } from './value'

export { createQueryDeserializer } from './query/createQueryDeserializer'
export { createPathDeserializer } from './path/createPathDeserializer'
export { createHeaderDeserializer } from './header/createHeaderDeserializer'

export type {
  PathDeserializers,
  PrimitiveRecord,
  PrimitiveArray,
  Primitive,
  FieldParsers,
  HeaderDeserializer,
  HeaderDeserializers,
  HeaderOptions,
  ParameterObject,
  ParameterValue,
  PathDeserializer,
  PathOptions,
  QueryDeserializer,
  QueryDeserializers,
  QueryOptions,
  RawHeaders,
  RawPathParams,
  RawQueryParams,
  ValueParser,
} from './types'

export const deserializers = {
  path,
  query,
  header,
  value,
}
