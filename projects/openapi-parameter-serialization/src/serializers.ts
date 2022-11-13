import { createHeaderSerializer } from './createHeaderSerializer'
import { createQuerySerializer } from './createQuerySerializer'
import { createPathSerializer } from './createPathSerializer'
import { createCookieSerializer } from './createCookieSerializer'

export const serializers = {
  createHeaderSerializer,
  createQuerySerializer,
  createPathSerializer,
  createCookieSerializer,
}
