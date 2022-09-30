import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { ExpressRoutersGenerator } from './ExpressRoutersGenerator'
import { ExpressRoutersGeneratorConfig as ExpressRoutersGeneratorConfig } from './typings'

function defaultConfig({
  getAllowedOrigins,
  isCredentialsAllowed,
  isResponseHeaderAllowed,
  ...rest
}: Partial<ExpressRoutersGeneratorConfig & GeneratorConfig>): ExpressRoutersGeneratorConfig & Partial<GeneratorConfig> {
  return {
    getAllowedOrigins: getAllowedOrigins ?? (() => false),
    isCredentialsAllowed: isCredentialsAllowed ?? (() => false),
    isResponseHeaderAllowed: isResponseHeaderAllowed ?? ((_, header) => header !== 'set-cookie'),
    ...rest,
  }
}

export function expressRouters(
  config: Partial<ExpressRoutersGeneratorConfig & GeneratorConfig> = {},
): OpenAPIGenerator {
  return new ExpressRoutersGenerator(defaultConfig(config))
}
