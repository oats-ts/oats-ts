import { PubSubSocket } from '@oats-ts/asyncapi-ws-client'
import { TestChannelSubType } from '../subTypes/TestChannelSubType'
import { TestChannelPubType } from '../pubTypes/TestChannelPubType'

export type TestChannel = PubSubSocket<TestChannelPubType, TestChannelSubType>
