import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '../types'
import { ExpressRoutesTypeGenerator } from './ExpressRoutesTypeGenerator'

export function expressRoutesType(config: Partial<GeneratorConfig> = {}): OpenAPIGenerator {
  return new ExpressRoutesTypeGenerator(config)
}
