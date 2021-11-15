import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { TypeGuardGeneratorConfig } from '@oats-ts/json-schema-type-guards-generator'
import { TypeGuardsGenerator } from './TypeGuardsGenerator'

export {
  FullTypeGuardGeneratorConfig,
  TypeGuardGeneratorConfig,
  UnionTypeGuardGeneratorConfig,
} from '@oats-ts/json-schema-type-guards-generator'

export { TypeGuardsGenerator } from './TypeGuardsGenerator'

export function typeGuards(config: TypeGuardGeneratorConfig): OpenAPIGenerator {
  return new TypeGuardsGenerator(config)
}
