import { RequestTypesGeneratorConfig } from './requestType/typings'
import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { RequestTypesGenerator } from './requestType/RequestTypesGenerator'
import { RequestServerTypesGenerator } from './requestServerType/RequestServerTypeGenerator'

export type { RequestTypesGeneratorConfig } from './requestType/typings'
export { RequestTypesGenerator } from './requestType/RequestTypesGenerator'

export function requestTypes(config: GeneratorConfig & RequestTypesGeneratorConfig): OpenAPIGenerator {
  return new RequestTypesGenerator(config)
}

export function requestServerTypes(config: GeneratorConfig): OpenAPIGenerator {
  return new RequestServerTypesGenerator(config)
}
