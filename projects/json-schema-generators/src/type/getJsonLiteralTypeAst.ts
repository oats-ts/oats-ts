import { safeName } from '@oats-ts/typescript-common'
import { entries } from 'lodash'
import { factory, TupleTypeNode, TypeLiteralNode, TypeNode } from 'typescript'

function getArrayLiteralTypeAst(value: any[]): TupleTypeNode {
  return factory.createTupleTypeNode(value.map((item) => getJsonLiteralTypeAst(item)))
}

function getObjectLiteralTypeAst(value: Record<string, any>): TypeLiteralNode {
  return factory.createTypeLiteralNode(
    entries(value).map(([key, propertyValue]) =>
      factory.createPropertySignature(undefined, safeName(key), undefined, getJsonLiteralTypeAst(propertyValue)),
    ),
  )
}

export function getJsonLiteralTypeAst(value: any): TypeNode {
  if (value === null) {
    return factory.createLiteralTypeNode(factory.createNull())
  } else if (typeof value === 'string') {
    return factory.createLiteralTypeNode(factory.createStringLiteral(value))
  } else if (typeof value === 'number') {
    return factory.createLiteralTypeNode(factory.createNumericLiteral(value))
  } else if (typeof value === 'boolean') {
    return factory.createLiteralTypeNode(value ? factory.createTrue() : factory.createFalse())
  } else if (Array.isArray(value)) {
    return getArrayLiteralTypeAst(value)
  } else if (typeof value === 'object') {
    return getObjectLiteralTypeAst(value)
  }
  // TODO if this happens, it needs a second look.
  return factory.createTypeReferenceNode('never')
}
