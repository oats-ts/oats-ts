import { OpenAPIGenerator } from '../types'
import { ExpressRoutesTypeGenerator } from './ExpressRoutesTypeGenerator'

export function expressRoutesType(): OpenAPIGenerator {
  return new ExpressRoutesTypeGenerator()
}
