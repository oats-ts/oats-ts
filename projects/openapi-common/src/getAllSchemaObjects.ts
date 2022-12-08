import { SchemaObject } from '@oats-ts/json-schema-model'
import { flatMap } from 'lodash'
import { getSchemaObjects } from './getSchemaObjects'
import { OpenAPIGeneratorContext } from './typings'

export function getAllSchemaObjects(context: OpenAPIGeneratorContext): SchemaObject[] {
  return flatMap(context.documents(), (doc) => getSchemaObjects(context, doc))
}
