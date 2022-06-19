import { Expression, factory, PropertyAccessExpression } from 'typescript'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { getInferredType } from '@oats-ts/json-schema-common'
import { OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { getLiteralAst, isIdentifier } from '@oats-ts/typescript-common'
import { entries } from 'lodash'

function valueAccess(field: string): PropertyAccessExpression {
  return factory.createPropertyAccessExpression(
    factory.createPropertyAccessExpression(
      factory.createIdentifier(RuntimePackages.ParameterSerialization.deserializers),
      factory.createIdentifier('value'),
    ),
    field,
  )
}

function createPrimitiveDeserializer(type: 'string' | 'number' | 'boolean', parameters: Expression[] = []) {
  return factory.createCallExpression(valueAccess(type), [], parameters)
}

function createOptional(expr: Expression): Expression {
  return factory.createCallExpression(valueAccess('optional'), [], [expr])
}

export function getDeserializerAst(
  schemaOrRef: Referenceable<SchemaObject>,
  context: OpenAPIGeneratorContext,
): Expression {
  const { dereference, referenceOf } = context
  const schema = dereference(schemaOrRef, true)
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
          valueAccess('enumeration'),
          [factory.createTypeReferenceNode(type), referenceOf(schemaOrRef, 'json-schema/type')],
          [factory.createArrayLiteralExpression(schema.enum.map((v) => getLiteralAst(v)))],
        ),
      ])
    }
    case 'array': {
      if (typeof schema.items !== 'boolean') {
        return getDeserializerAst(schema.items, context)
      }
      return factory.createIdentifier('undefined')
    }
    case 'object': {
      const properties = entries(schema.properties).map(([name, propSchema]) => {
        const isRequired = (schema.required || []).indexOf(name) >= 0
        const deserializer = getDeserializerAst(propSchema, context)
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
