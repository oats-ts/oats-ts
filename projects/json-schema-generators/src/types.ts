import { GeneratorContext, ReadOutput, HasSchemas } from '@oats-ts/model-common'

export type JsonSchemaGeneratorTarget = 'oats/type' | 'oats/type-guard' | 'oats/type-validator'

export type JsonSchemaGeneratorContext = GeneratorContext<HasSchemas, JsonSchemaGeneratorTarget>

export type JsonSchemaReadOutput = ReadOutput<HasSchemas>

export type TraversalHelper = {
  uriOf<T>(input: T): string | undefined
  parent<T, P>(input: T): P | undefined
  nameOf<T>(input: T, target: string): string
}
