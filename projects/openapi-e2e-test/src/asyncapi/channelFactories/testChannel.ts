import { WebsocketConfig } from '@oats-ts/asyncapi-ws-client'
import { joinUrl, serializeQuery } from '@oats-ts/asyncapi-parameter-serialization'
import { TestChannel } from '../channels/TestChannel'
import { TestChannelInput } from '../inputTypes/TestChannelInput'
import { testChannelPathSerializer } from '../pathSerializers/testChannelPathSerializer'

export function testChannel(input: TestChannelInput, config: WebsocketConfig): TestChannel {
  return config.adapter(
    joinUrl(config.baseUrl, testChannelPathSerializer(input.path), serializeQuery(input.query)),
    config,
  )
}
