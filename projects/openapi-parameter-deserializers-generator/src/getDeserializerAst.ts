import { Expression, factory } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { getInferredType } from '@oats-ts/json-schema-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getLiteralAst, isIdentifier } from '@oats-ts/typescript-common'
import { entries } from 'lodash'

function createPrimitiveDeserializer(type: 'string' | 'number' | 'boolean', parameters: Expression[] = []) {
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(factory.createIdentifier('value'), type),
    [],
    parameters,
  )
}

function createOptional(expr: Expression): Expression {
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(factory.createIdentifier('value'), 'optional'),
    [],
    [expr],
  )
}

export function getDeserializerAst(schema: SchemaObject, context: OpenAPIGeneratorContext): Expression {
  const { dereference } = context
  const inferredType = getInferredType(schema)
  switch (inferredType) {
    case 'string':
    case 'number':
    case 'boolean': {
      return createPrimitiveDeserializer(inferredType)
    }
    case 'enum': {
      const type = schema.type === 'number' || schema.type === 'integer' ? 'number' : 'string'
      return createPrimitiveDeserializer(type, [
        factory.createCallExpression(
          factory.createPropertyAccessExpression(factory.createIdentifier('value'), 'enumeration'),
          [],
          [factory.createArrayLiteralExpression(schema.enum.map((v) => getLiteralAst(v)))],
        ),
      ])
    }
    case 'array': {
      return getDeserializerAst(dereference(schema.items, true), context)
    }
    case 'object': {
      const properties = entries(schema.properties).map(([name, propSchema]) => {
        const isRequired = (schema.required || []).indexOf(name) >= 0
        const deserializer = getDeserializerAst(dereference(propSchema, true), context)
        return factory.createPropertyAssignment(
          isIdentifier(name) ? name : factory.createStringLiteral(name),
          isRequired ? deserializer : createOptional(deserializer),
        )
      })
      return factory.createObjectLiteralExpression(properties)
    }
    default:
      return factory.createIdentifier('undefined')
  }
}
