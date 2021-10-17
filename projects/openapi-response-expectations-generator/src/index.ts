import { ResponseExpectationsGeneratorConfig } from './typings'
import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ResponseExpectationsGenerator } from './ResponseExpectationsGenerator'

export type { ResponseExpectationsGeneratorConfig } from './typings'
export { ResponseExpectationsGenerator } from './ResponseExpectationsGenerator'

export function responseExpectations(config: GeneratorConfig & ResponseExpectationsGeneratorConfig): OpenAPIGenerator {
  return new ResponseExpectationsGenerator(config)
}
