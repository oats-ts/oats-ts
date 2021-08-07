import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { TypeGuardGeneratorConfig } from './typings'
import { TypeGuardsGenerator } from './TypeGuardsGenerator'

export { FullTypeGuardGeneratorConfig, TypeGuardGeneratorConfig, UnionTypeGuardGeneratorConfig } from './typings'
export { TypeGuardsGenerator } from './TypeGuardsGenerator'

export function typeGuards(config: GeneratorConfig & TypeGuardGeneratorConfig): OpenAPIGenerator {
  return new TypeGuardsGenerator(config)
}
