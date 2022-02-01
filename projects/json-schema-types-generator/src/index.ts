import { HasSchemas, ReadOutput } from '@oats-ts/model-common'
import { JsonSchemaTypesGenerator } from './JsonSchemaTypesGenerator'
import { TypesGeneratorConfig } from './typings'

export type { TypesGeneratorConfig, TypesGeneratorContext } from './typings'
export { JsonSchemaTypesGenerator } from './JsonSchemaTypesGenerator'

const DefaultConfig: TypesGeneratorConfig = { documentation: true }

export const types =
  <T extends ReadOutput<HasSchemas>, Id extends string, C extends string>(id: Id) =>
  (config: Partial<TypesGeneratorConfig> = DefaultConfig) =>
    new JsonSchemaTypesGenerator<T, Id, C>(id, config)
