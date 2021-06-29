import { OperationsGeneratorConfig } from './typings'
import { OpenAPIGenerator, OpenAPIGeneratorConfig } from '@oats-ts/openapi-common'
import { OperationsGenerator } from './OperationsGenerator'

export { OperationsGeneratorConfig } from './typings'
export { OperationsGenerator } from './OperationsGenerator'

export function operations(config: OpenAPIGeneratorConfig & OperationsGeneratorConfig): OpenAPIGenerator {
  return new OperationsGenerator(config)
}
