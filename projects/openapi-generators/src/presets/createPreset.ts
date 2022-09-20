import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { OpenAPIGenerator } from '../types'
import { entries, isNil } from 'lodash'
import { ConfigProducer, PresetGeneratorConfiguration } from './types'
import { CompositeGenerator, GeneratorConfig } from '@oats-ts/oats-ts'
import { generatorFactoryMap } from '../generatorFactoryMap'

export const createPreset =
  <T extends Partial<GeneratorConfig>>(
    name: string,
    defaultConfig: PresetGeneratorConfiguration,
    produceConfig: ConfigProducer<T>,
  ) =>
  (config?: T): OpenAPIGenerator => {
    const generatorConfig: Partial<GeneratorConfig> = {
      ...(isNil(config?.nameProvider) ? {} : { nameProvider: config?.nameProvider }),
      ...(isNil(config?.pathProvider) ? {} : { pathProvider: config?.pathProvider }),
      ...(isNil(config?.noEmit) ? {} : { noEmit: config?.noEmit }),
    }
    const fullConfig = produceConfig(defaultConfig, config)
    const generators: OpenAPIGenerator[] = []
    const targetsWithConfigs = entries(fullConfig).sort(([t1], [t2]) => t1.localeCompare(t2))
    for (const [target, generatorConfig] of targetsWithConfigs) {
      if (generatorConfig !== false && !isNil(generatorConfig)) {
        const factory = generatorFactoryMap[target as OpenAPIGeneratorTarget]
        if (isNil(factory)) {
          throw new TypeError(`Unknown target "${target}"`)
        }
        generators.push(generatorConfig === true ? factory() : factory(generatorConfig))
      }
    }
    const computedName = !isNil(config) ? `${name} (custom)` : name
    return new CompositeGenerator(computedName, generators, generatorConfig)
  }
