import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { CorsConfigurationGenerator } from './CorsConfigurationGenerator'
import { CorsConfigurationGeneratorConfig } from './typings'

function defaultConfig({
  getAllowedOrigins,
  getMaxAge,
  isCredentialsAllowed,
  isMethodAllowed,
  isRequestHeaderAllowed,
  isResponseHeaderAllowed,
  ...rest
}: Partial<CorsConfigurationGeneratorConfig & GeneratorConfig>): CorsConfigurationGeneratorConfig &
  Partial<GeneratorConfig> {
  return {
    getAllowedOrigins: getAllowedOrigins ?? (() => false),
    getMaxAge: getMaxAge ?? (() => undefined),
    isMethodAllowed: isMethodAllowed ?? (() => true),
    isCredentialsAllowed: isCredentialsAllowed ?? (() => undefined),
    isRequestHeaderAllowed: isRequestHeaderAllowed ?? (() => true),
    isResponseHeaderAllowed: isResponseHeaderAllowed ?? (() => true),
    ...rest,
  }
}

export function corsConfiguration(
  config: Partial<CorsConfigurationGeneratorConfig & GeneratorConfig> = {},
): OpenAPICodeGenerator {
  return new CorsConfigurationGenerator(defaultConfig(config))
}
