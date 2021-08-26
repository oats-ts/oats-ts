import { createPathSerializer } from '@oats-ts/asyncapi-parameter-serialization'

export const testChannelPathSerializer = createPathSerializer('/test/{test}')
