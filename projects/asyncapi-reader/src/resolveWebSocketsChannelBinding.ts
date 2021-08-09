import { WebSocketsChannelBinding } from '@oats-ts/asyncapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { isNil } from 'lodash'
import { webSocketsChannelBinding } from './validators/webSocketsChannelBinding'
import { resolveReferenceable } from './resolveReferenceable'
import { resolveSchemaObject } from './resolveSchemaObject'

export async function resolveWebSocketsChannelBinding(
  input: ReadInput<WebSocketsChannelBinding>,
  context: ReadContext,
): Promise<void> {
  if (!validate(input, context, webSocketsChannelBinding)) {
    return
  }
  const { data, uri } = input
  const { headers, query } = data

  if (!isNil(headers)) {
    await resolveReferenceable({ data: headers, uri: context.uri.append(uri, 'headers') }, context, resolveSchemaObject)
  }

  if (!isNil(query)) {
    await resolveReferenceable({ data: query, uri: context.uri.append(uri, 'query') }, context, resolveSchemaObject)
  }

  register(input, context)
}
