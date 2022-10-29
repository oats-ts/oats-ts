import { createHeaderSerializer } from './createHeaderSerializer'
import { createQuerySerializer } from './createQuerySerializer'
import { createPathSerializer } from './createPathSerializer'
import { createCookieSerializer } from './createCookieSerializer'
import { createSetCookieSerializer } from './createSetCookieSerializer'

export const serializers = {
  createHeaderSerializer,
  createQuerySerializer,
  createPathSerializer,
  createCookieSerializer,
  createSetCookieSerializer,
}
