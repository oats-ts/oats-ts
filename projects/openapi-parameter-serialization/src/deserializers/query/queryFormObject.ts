import { Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import {
  DslConfig,
  FieldValueDeserializers,
  PrimitiveRecord,
  QueryParameterDeserializer,
  RawQueryParams,
} from '../../types'
import { queryFormObjectExplode } from './queryFormObjectExplode'
import { queryFormObjectNoExplode } from './queryFormObjectNoExplode'

export const queryFormObject =
  <T extends PrimitiveRecord>(
    parsers: FieldValueDeserializers<T>,
    opts: Partial<DslConfig> = {},
  ): QueryParameterDeserializer<T> =>
  (data: RawQueryParams, name: string, path: string, config: ValidatorConfig): Try<T> => {
    const options: DslConfig = { explode: true, required: false, ...opts }
    const delegate = options.explode ? queryFormObjectExplode : queryFormObjectNoExplode
    return delegate(parsers, options, name, path, data, config)
  }
