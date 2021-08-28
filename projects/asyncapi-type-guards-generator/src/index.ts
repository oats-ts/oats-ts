import { GeneratorConfig } from '@oats-ts/generator'
import { AsyncAPIGenerator } from '@oats-ts/asyncapi-common'
import { TypeGuardGeneratorConfig } from '@oats-ts/json-schema-type-guards-generator'
import { TypeGuardsGenerator } from './TypeGuardsGenerator'

export {
  FullTypeGuardGeneratorConfig,
  TypeGuardGeneratorConfig,
  UnionTypeGuardGeneratorConfig,
} from '@oats-ts/json-schema-type-guards-generator'

export { TypeGuardsGenerator } from './TypeGuardsGenerator'

export function typeGuards(config: GeneratorConfig & TypeGuardGeneratorConfig): AsyncAPIGenerator {
  return new TypeGuardsGenerator(config)
}
