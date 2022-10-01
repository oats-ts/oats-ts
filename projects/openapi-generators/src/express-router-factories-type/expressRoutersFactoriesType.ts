import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressRouterFactoriesTypeGenerator } from './ExpressRouterFactoriesTypeGenerator'

export function expressRoutersFactoriesType(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressRouterFactoriesTypeGenerator(config)
}
