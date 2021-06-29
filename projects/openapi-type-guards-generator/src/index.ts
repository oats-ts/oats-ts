import { OpenAPIGeneratorConfig } from '@oats-ts/openapi'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { TypeGuardGeneratorConfig } from './typings'
import { TypeGuardsGenerator } from './TypeGuardsGenerator'

export { FullTypeGuardGeneratorConfig, TypeGuardGeneratorConfig, UnionTypeGuardGeneratorConfig } from './typings'
export { TypeGuardsGenerator } from './TypeGuardsGenerator'

export function typeGuards(config: OpenAPIGeneratorConfig & TypeGuardGeneratorConfig): OpenAPIGenerator {
  return new TypeGuardsGenerator(config)
}
