import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { ExpressRouterFactoriesTypeGenerator } from './ExpressRouterFactoriesTypeGenerator'

export function expressRoutersFactoriesType(config: Partial<GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new ExpressRouterFactoriesTypeGenerator(config)
}
