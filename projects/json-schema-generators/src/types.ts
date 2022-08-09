import { GeneratorContext, ReadOutput, HasSchemas } from '@oats-ts/model-common'

export type JsonSchemaGeneratorTarget = 'oats/type' | 'oats/type-guard' | 'oats/type-validator'

export type JsonSchemaGeneratorContext = GeneratorContext<HasSchemas, JsonSchemaGeneratorTarget>

export type JsonSchemaReadOutput = ReadOutput<HasSchemas>
