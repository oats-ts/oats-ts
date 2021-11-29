import { OperationsGeneratorConfig } from './typings'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { OperationsGenerator } from './OperationsGenerator'

export type { OperationsGeneratorConfig } from './typings'
export { OperationsGenerator } from './OperationsGenerator'

export function operations(config: OperationsGeneratorConfig): OpenAPIGenerator {
  return new OperationsGenerator(config)
}
