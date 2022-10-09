import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { ImportDeclaration } from 'typescript'
import { TraversalHelper } from '../types'

export type ValidatorImportProvider = {
  getImports: (fromPath: string, schema: Referenceable<SchemaObject>) => ImportDeclaration[]
}

export type ValidatorsGeneratorConfig = {
  ignore: (schema: Referenceable<SchemaObject>, helper: TraversalHelper) => boolean
}
