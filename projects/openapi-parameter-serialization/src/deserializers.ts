import { createHeaderDeserializer } from './createHeaderDeserializer'
import { createQueryDeserializer } from './createQueryDeserializer'
import { createPathDeserializer } from './createPathDeserializer'
import { createCookieDeserializer } from './createCookieDeserializer'

export const deserializers = {
  createHeaderDeserializer,
  createQueryDeserializer,
  createPathDeserializer,
  createCookieDeserializer,
}
