import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { ResponseTypesGenerator } from './ResponseTypesGenerator'
import { ResponseTypesGeneratorConfig } from './typings'

function defaultConfig({
  cookies,
  ...rest
}: Partial<ResponseTypesGeneratorConfig & GeneratorConfig>): ResponseTypesGeneratorConfig & Partial<GeneratorConfig> {
  return {
    cookies: cookies ?? false,
    ...rest,
  }
}

export function responseTypes(config: Partial<GeneratorConfig & ResponseTypesGeneratorConfig> = {}): OpenAPICodeGenerator {
  return new ResponseTypesGenerator(defaultConfig(config))
}
