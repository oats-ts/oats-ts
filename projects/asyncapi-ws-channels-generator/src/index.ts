import { ChannelsGenerator } from './ChannelsGenerator'
import { ChannelsGeneratorConfig } from './types'

export type { ChannelsGeneratorConfig } from './types'
export { ChannelsGenerator } from './ChannelsGenerator'

export function channels(config: ChannelsGeneratorConfig) {
  return new ChannelsGenerator(config)
}
