import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressRoutersTypeGenerator } from './ExpressRoutersTypeGenerator'

export function expressRoutersType(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressRoutersTypeGenerator(config)
}
