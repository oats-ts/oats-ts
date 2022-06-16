import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'

export type ValidatorsGeneratorConfig = {
  ignore: (schema: Referenceable<SchemaObject>, uri: string) => boolean
}
