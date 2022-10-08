import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { TraversalHelper } from '../types'

export type TypeGuardGeneratorConfig = {
  ignore: (schema: Referenceable<SchemaObject>, helper: TraversalHelper) => boolean
}
