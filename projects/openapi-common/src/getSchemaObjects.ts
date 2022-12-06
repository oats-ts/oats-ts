import { SchemaObject } from '@oats-ts/json-schema-model'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { OpenAPITraverser } from './OpenAPITraverser'
import { OpenAPIGeneratorContext, OpenAPIVisitor } from './typings'

export function getSchemaObjects(context: OpenAPIGeneratorContext, document: OpenAPIObject): SchemaObject[] {
  if (!context.documents().includes(document)) {
    throw new TypeError(`Context doesn't have the requested document registered`)
  }
  const visitor: Partial<OpenAPIVisitor<Set<SchemaObject>>> = {
    visitSchemaObject(data, set) {
      set.add(data)
      return true
    },
  }
  const traverser = new OpenAPITraverser(new Set<SchemaObject>(), visitor)
  traverser.traverseOpenAPIObject(document)
  return Array.from(traverser.input)
}
