import { WebsocketConfig } from '@oats-ts/asyncapi-ws-client'
import { TestChannelInput } from '../inputTypes/TestChannelInput'
import { TestChannel } from '../channels/TestChannel'
import { Api } from './Api'
import { testChannel } from '../channelFactories/testChannel'

export class ApiImpl implements Api {
  protected readonly config: WebsocketConfig
  public constructor(config: WebsocketConfig) {
    this.config = config
  }
  public testChannel(input: TestChannelInput, config: Partial<WebsocketConfig> = {}): TestChannel {
    return testChannel(input, { ...this.config, ...config })
  }
}
