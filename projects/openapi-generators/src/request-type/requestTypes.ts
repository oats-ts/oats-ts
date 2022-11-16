import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { RequestTypesGenerator } from './RequestTypesGenerator'
import { RequestTypesGeneratorConfig } from './typings'

function defaultConfig({
  cookies,
  ...rest
}: Partial<RequestTypesGeneratorConfig & GeneratorConfig>): RequestTypesGeneratorConfig & Partial<GeneratorConfig> {
  return {
    cookies: cookies ?? false,
    ...rest,
  }
}

export function requestTypes(config: Partial<RequestTypesGeneratorConfig & GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new RequestTypesGenerator(defaultConfig(config))
}
