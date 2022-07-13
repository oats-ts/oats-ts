import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { OpenAPIGenerator } from '../types'
import { entries, isNil, keys } from 'lodash'
import { PresetConfiguration, PresetGeneratorConfiguration } from './types'
import { CompositeGenerator } from '@oats-ts/oats-ts'
import { generatorFactoryMap } from '../generatorFactoryMap'

export const createPreset =
  (name: string, defaultConfig: PresetGeneratorConfiguration) =>
  (config: Partial<PresetConfiguration> = {}): OpenAPIGenerator => {
    const { overrides = {}, ...cfg } = config
    const generators: OpenAPIGenerator[] = []
    for (const [target, generatorConfig] of entries({ ...defaultConfig, ...overrides })) {
      if (generatorConfig !== false && !isNil(generatorConfig)) {
        const factory = generatorFactoryMap[target as OpenAPIGeneratorTarget]
        if (isNil(factory)) {
          throw new TypeError(`Unknown target "${target}"`)
        }
        generators.push(generatorConfig === true ? factory() : factory(generatorConfig))
      }
    }
    return new CompositeGenerator(keys(overrides).length > 0 ? `${name} (custom)` : name, generators, cfg)
  }
