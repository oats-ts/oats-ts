import { header as headerD } from './deserializers/header'
import { path as pathD } from './deserializers/path'
import { query as queryD } from './deserializers/query'
import { value as valueD } from './deserializers/value'

import { path as pathS } from './serializers/path'
import { header as headerS } from './serializers/header'
import { query as queryS } from './serializers/query'

export { createQueryDeserializer } from './deserializers/query/createQueryDeserializer'
export { createPathDeserializer } from './deserializers/path/createPathDeserializer'
export { createHeaderDeserializer } from './deserializers/header/createHeaderDeserializer'

export { createQuerySerializer } from './serializers/query/createQuerySerializer'
export { createPathSerializer } from './serializers/path/createPathSerializer'
export { createHeaderSerializer } from './serializers/header/createHeaderSerializer'
export { joinUrl } from './serializers/joinUrl'

export type {
  PathValueDeserializers,
  PrimitiveRecord,
  PrimitiveArray,
  Primitive,
  FieldParsers,
  HeaderValueDeserializer,
  HeaderValueDeserializers,
  HeaderOptions,
  ParameterObject,
  ParameterValue,
  PathValueDeserializer,
  PathOptions,
  QueryValueDeserializer,
  QueryValueDeserializers,
  QueryOptions,
  RawHeaders,
  RawPathParams,
  RawQueryParams,
  ValueParser,
} from './deserializers/types'

export type {
  HeaderSerializers,
  HeaderSerializer,
  PathSerializer,
  PathSerializers,
  QuerySerializer,
  QuerySerializers,
} from './serializers/types'

export const serializers = {
  path: pathS,
  query: queryS,
  header: headerS,
}

export const deserializers = {
  path: pathD,
  query: queryD,
  header: headerD,
  value: valueD,
}
