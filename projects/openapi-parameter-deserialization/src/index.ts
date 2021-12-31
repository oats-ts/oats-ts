import { header } from './header'
import { path } from './path'
import { query } from './query'
import { value } from './value'

export { createQueryDeserializer } from './query/createQueryDeserializer'
export { createPathDeserializer } from './path/createPathDeserializer'
export { createHeaderDeserializer } from './header/createHeaderDeserializer'

export type {
  PathValueDeserializers as PathDeserializers,
  PrimitiveRecord,
  PrimitiveArray,
  Primitive,
  FieldParsers,
  HeaderValueDeserializer as HeaderDeserializer,
  HeaderValueDeserializers as HeaderDeserializers,
  HeaderOptions,
  ParameterObject,
  ParameterValue,
  PathValueDeserializer as PathDeserializer,
  PathOptions,
  QueryValueDeserializer as QueryDeserializer,
  QueryValueDeserializers as QueryDeserializers,
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
