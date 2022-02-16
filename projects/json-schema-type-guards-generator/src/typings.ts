import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'

export type TypeGuardGeneratorConfig = {
  ignore: (schema: Referenceable<SchemaObject>, uri: string) => boolean
}
