import { FetchAdapterConfig } from '../typings'
import { defaultParseResponse } from './defaultParseResponse'

export function defaultFetchAdapterConfig(config: FetchAdapterConfig): FetchAdapterConfig {
  return {
    init: config.init || {},
    parse: config.parse || defaultParseResponse,
  }
}
