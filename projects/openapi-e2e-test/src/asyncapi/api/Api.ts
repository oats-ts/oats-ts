import { TestChannelInput } from '../inputTypes/TestChannelInput'
import { TestChannel } from '../channels/TestChannel'
import { WebsocketConfig } from '@oats-ts/asyncapi-ws-client'

export type Api = {
  testChannel(input: TestChannelInput, config?: Partial<WebsocketConfig>): TestChannel
}