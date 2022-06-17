import { Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { QueryOptions, PrimitiveRecord, FieldParsers, RawQueryParams, QueryValueDeserializer } from '../types'
import { queryFormObjectExplode } from './queryFormObjectExplode'
import { queryFormObjectNoExplode } from './queryFormObjectNoExplode'

export const queryFormObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, opts: QueryOptions = {}): QueryValueDeserializer<T> =>
  (data: RawQueryParams, name: string, path: string, config: ValidatorConfig): Try<T> => {
    const options: QueryOptions = { explode: true, ...opts }
    const delegate = options.explode ? queryFormObjectExplode : queryFormObjectNoExplode
    return delegate(parsers, options, name, path, data, config)
  }
