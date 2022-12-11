import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { getInferredType } from './getInferredType'
import { isReferenceObject } from './isReferenceObject'
import { OpenAPIGeneratorContext, PrimitiveType } from './typings'

function getPrimitiveValueType(value: any): PrimitiveType {
  if (value === null || value === undefined) {
    return 'nil'
  }
  const type = typeof value
  switch (type) {
    case 'boolean':
    case 'number':
    case 'string':
      return type
    default:
      return 'non-primitive'
  }
}

function collectPrimtiveTypes(
  schema: Referenceable<SchemaObject>,
  context: OpenAPIGeneratorContext,
  types: Set<PrimitiveType>,
): void {
  if (isReferenceObject(schema)) {
    const target = context.dereference(schema)
    return collectPrimtiveTypes(target, context, types)
  }
  const inferredType = getInferredType(schema)
  switch (inferredType) {
    case 'number':
    case 'string':
    case 'boolean': {
      types.add(inferredType)
      break
    }
    case 'literal': {
      types.add(getPrimitiveValueType(schema.const))
      break
    }
    case 'enum': {
      const { enum: e = [] } = schema
      e.forEach((value) => types.add(getPrimitiveValueType(value)))
      break
    }
    case 'union': {
      const { oneOf = [] } = schema
      oneOf.forEach((child) => collectPrimtiveTypes(child, context, types))
      break
    }
    case 'intersection': {
      const { allOf = [] } = schema
      allOf.forEach((child) => collectPrimtiveTypes(child, context, types))
      break
    }
    default: {
      types.add('non-primitive')
      break
    }
  }
}

export function getPrimitiveTypes(
  schema: Referenceable<SchemaObject>,
  context: OpenAPIGeneratorContext,
): PrimitiveType[] {
  const types = new Set<PrimitiveType>()
  collectPrimtiveTypes(schema, context, types)
  return Array.from(types)
}
