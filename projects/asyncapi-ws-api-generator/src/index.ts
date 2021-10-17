import { GeneratorConfig } from '@oats-ts/generator'
import { ApiGenerator } from './ApiGenerator'
import { ApiGeneratorConfig } from './types'

export type { ApiGeneratorConfig } from './types'
export { ApiGenerator } from './ApiGenerator'

export function api(config: GeneratorConfig & ApiGeneratorConfig) {
  return new ApiGenerator(config)
}
