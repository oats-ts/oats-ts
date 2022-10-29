import { createHeaderDeserializer } from './createHeaderDeserializer'
import { createQueryDeserializer } from './createQueryDeserializer'
import { createPathDeserializer } from './createPathDeserializer'
import { createCookieDeserializer } from './createCookieDeserializer'
import { createSetCookieDeserializer } from './createSetCookieDeserializer'

export const deserializers = {
  createHeaderDeserializer,
  createQueryDeserializer,
  createPathDeserializer,
  createCookieDeserializer,
  createSetCookieDeserializer,
}
