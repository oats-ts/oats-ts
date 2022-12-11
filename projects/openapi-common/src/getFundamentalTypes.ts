import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { getInferredType } from './getInferredType'
import { isReferenceObject } from './isReferenceObject'
import { FundamentalType, OpenAPIGeneratorContext } from './typings'

function getFundamentalValueType(value: any): FundamentalType {
  if (value === null || value === undefined) {
    return 'nil'
  }
  if (Array.isArray(value)) {
    return 'array'
  }
  switch (typeof value) {
    case 'boolean':
    case 'number':
    case 'string':
      return 'primitive'
    case 'object':
      return 'object'
    default:
      return 'unknown'
  }
}

function collectFundamentalTypes(
  schema: Referenceable<SchemaObject>,
  context: OpenAPIGeneratorContext,
  types: Set<FundamentalType>,
): void {
  if (isReferenceObject(schema)) {
    const target = context.dereference(schema)
    return collectFundamentalTypes(target, context, types)
  }
  switch (getInferredType(schema)) {
    case 'array': {
      types.add('array')
      break
    }
    case 'object': {
      types.add('object')
      break
    }
    case 'number':
    case 'string':
    case 'boolean': {
      types.add('primitive')
      break
    }
    case 'literal': {
      types.add(getFundamentalValueType(schema.const))
      break
    }
    case 'enum': {
      const { enum: e = [] } = schema
      e.forEach((value) => types.add(getFundamentalValueType(value)))
      break
    }
    case 'union': {
      const { oneOf = [] } = schema
      oneOf.forEach((child) => collectFundamentalTypes(child, context, types))
      break
    }
    case 'intersection': {
      const { allOf = [] } = schema
      allOf.forEach((child) => collectFundamentalTypes(child, context, types))
      break
    }
    default: {
      types.add('unknown')
      break
    }
  }
}

export function getFundamentalTypes(
  schema: Referenceable<SchemaObject>,
  context: OpenAPIGeneratorContext,
): FundamentalType[] {
  const types = new Set<FundamentalType>()
  collectFundamentalTypes(schema, context, types)
  return Array.from(types)
}
