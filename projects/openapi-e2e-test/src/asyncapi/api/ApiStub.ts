import { WebsocketConfig } from '@oats-ts/asyncapi-ws-client'
import { TestChannelInput } from '../inputTypes/TestChannelInput'
import { TestChannel } from '../channels/TestChannel'
import { Api } from './Api'

export class ApiStub implements Api {
  protected fallback(): never {
    throw new Error('Not implemented.')
  }
  public testChannel(input: TestChannelInput, config: Partial<WebsocketConfig> = {}): TestChannel {
    return this.fallback()
  }
}
