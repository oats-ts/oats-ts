import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressRoutesTypeGenerator } from './ExpressRoutesTypeGenerator'

export function expressRoutesType(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressRoutesTypeGenerator(config)
}
