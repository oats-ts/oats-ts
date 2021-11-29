export { createQuerySerializer } from './query/createQuerySerializer'
export { createPathSerializer } from './path/createPathSerializer'
export { createHeaderSerializer } from './header/createHeaderSerializer'
export { joinUrl } from './joinUrl'

export type {
  HeaderSerializers,
  QueryOptions,
  PathOptions,
  ParameterValue,
  ParameterObject,
  HeaderOptions,
  Primitive,
  PrimitiveArray,
  PrimitiveRecord,
  HeaderSerializer,
  PathSerializer,
  PathSerializers,
  QuerySerializer,
  QuerySerializers,
} from './types'

import { path } from './path'
import { header } from './header'
import { query } from './query'

export const serializers = {
  path,
  query,
  header,
}
