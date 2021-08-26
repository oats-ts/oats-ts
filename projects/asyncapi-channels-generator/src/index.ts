import { GeneratorConfig } from '@oats-ts/generator'
import { ChannelsGenerator } from './ChannelsGenerator'
import { ChannelsGeneratorConfig } from './types'

export { ChannelsGeneratorConfig } from './types'
export { ChannelsGenerator } from './ChannelsGenerator'

export function channels(config: GeneratorConfig & ChannelsGeneratorConfig) {
  return new ChannelsGenerator(config)
}
