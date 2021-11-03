import { getInferredType, isReferenceObject } from '@oats-ts/json-schema-common'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { values } from 'lodash'

function recursiveCollectEnumSchemas(
  input: Referenceable<SchemaObject>,
  context: OpenAPIGeneratorContext,
  references: Set<Referenceable<SchemaObject>>,
): void {
  const { dereference } = context
  if (isReferenceObject(input)) {
    const schema = dereference<SchemaObject>(input, true)
    if (getInferredType(schema) === 'enum') {
      references.add(input)
    }
    return
  }
  const inferredType = getInferredType(input)
  switch (inferredType) {
    case 'object': {
      return values(input.properties).forEach((property) => recursiveCollectEnumSchemas(property, context, references))
    }
    case 'array': {
      return recursiveCollectEnumSchemas(input.items, context, references)
    }
  }
}

export function collectEnumSchemas(input: Referenceable<SchemaObject>, context: OpenAPIGeneratorContext) {
  const refs = new Set<Referenceable<SchemaObject>>()
  recursiveCollectEnumSchemas(input, context, refs)
  return Array.from(refs)
}
