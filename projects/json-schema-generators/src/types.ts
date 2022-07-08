import { GeneratorContext, ReadOutput, HasSchemas } from '@oats-ts/model-common'

export type JsonSchemaGeneratorTarget = 'json-schema/type' | 'json-schema/type-guard' | 'json-schema/type-validator'

export type JsonSchemaGeneratorContext = GeneratorContext<HasSchemas, JsonSchemaGeneratorTarget>

export type JsonSchemaReadOutput = ReadOutput<HasSchemas>
