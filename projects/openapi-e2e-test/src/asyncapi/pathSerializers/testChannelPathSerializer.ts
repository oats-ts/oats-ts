import { createPathSerializer } from '@oats-ts/asyncapi-ws-parameter-serialization'

export const testChannelPathSerializer = createPathSerializer('/test/{test}')
