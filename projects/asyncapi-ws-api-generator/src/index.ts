import { ApiGenerator } from './ApiGenerator'
import { ApiGeneratorConfig } from './types'

export type { ApiGeneratorConfig } from './types'
export { ApiGenerator } from './ApiGenerator'

export function api(config: ApiGeneratorConfig) {
  return new ApiGenerator(config)
}
