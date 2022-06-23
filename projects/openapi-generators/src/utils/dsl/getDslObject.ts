import { BaseParameterObject, ParameterObject } from '@oats-ts/openapi-model'
import {
  getParameterKind,
  getParameterName,
  getParameterStyle,
  OpenAPIGeneratorContext,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { entries, flatMap, has } from 'lodash'
import { Expression, factory, ObjectLiteralExpression, PropertyAccessExpression, PropertyAssignment } from 'typescript'
import { isIdentifier, getLiteralAst } from '@oats-ts/typescript-common'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { getInferredType } from '@oats-ts/json-schema-common'

export function getDslObject(
  parameters: Referenceable<BaseParameterObject>[],
  context: OpenAPIGeneratorContext,
): ObjectLiteralExpression {
  return factory.createObjectLiteralExpression(parameters.map((parameter) => getParameterDsl(parameter, context)))
}

function getParameterDsl(
  param: Referenceable<BaseParameterObject>,
  context: OpenAPIGeneratorContext,
): PropertyAssignment {
  const name = getParameterName(param, context)

  const parameter = context.dereference(param, true)
  const schema = context.dereference(parameter.schema)
  const kind = getParameterKind(schema)
  const { in: location = 'header' } = parameter as ParameterObject

  return factory.createPropertyAssignment(
    isIdentifier(name) ? name : factory.createStringLiteral(name),
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(RuntimePackages.ParameterSerialization.dsl),
            factory.createIdentifier(location),
          ),
          factory.createIdentifier(getParameterStyle(parameter)),
        ),
        factory.createIdentifier(kind),
      ),
      [],
      [getTypeDsl(schema, context), ...getDslOptions(parameter)],
    ),
  )
}

function getTypeDsl(schemaOrRef: Referenceable<SchemaObject>, context: OpenAPIGeneratorContext): Expression {
  const schema = context.dereference(schemaOrRef, true)
  const inferredType = getInferredType(schema)
  switch (inferredType) {
    case 'string':
    case 'number':
    case 'boolean': {
      return factory.createCallExpression(valueAccess(inferredType), [], [])
    }
    case 'enum': {
      const type = schema.type === 'number' || schema.type === 'integer' ? 'number' : 'string'
      return factory.createCallExpression(
        valueAccess(type),
        [],
        [
          factory.createCallExpression(valueAccess('enum'), undefined, [
            factory.createArrayLiteralExpression(schema.enum.map((v) => getLiteralAst(v))),
          ]),
        ],
      )
    }
    case 'array': {
      if (typeof schema.items !== 'boolean') {
        return getTypeDsl(schema.items, context)
      }
      return factory.createIdentifier('undefined')
    }
    case 'object': {
      const properties = entries(schema.properties).map(([name, propSchema]) => {
        const isRequired = (schema.required || []).indexOf(name) >= 0
        const typeDsl = getTypeDsl(propSchema, context)
        return factory.createPropertyAssignment(
          isIdentifier(name) ? name : factory.createStringLiteral(name),
          isRequired ? typeDsl : factory.createCallExpression(valueAccess('optional'), [], [typeDsl]),
        )
      })
      return factory.createObjectLiteralExpression(properties)
    }
    default:
      return factory.createIdentifier('undefined')
  }
}

function valueAccess(field: string): PropertyAccessExpression {
  return factory.createPropertyAccessExpression(
    factory.createPropertyAccessExpression(
      factory.createIdentifier(RuntimePackages.ParameterSerialization.dsl),
      factory.createIdentifier('value'),
    ),
    field,
  )
}

function getDslOptions(parameter: BaseParameterObject): ObjectLiteralExpression[] {
  const { in: location = 'header' } = parameter as ParameterObject
  const keys: (keyof BaseParameterObject)[] = location === 'path' ? ['explode'] : ['explode', 'required']
  const properties = flatMap(keys, (key) => {
    if (has(parameter, key)) {
      return [
        factory.createPropertyAssignment(
          factory.createIdentifier(key.toString()),
          Boolean(parameter[key]) ? factory.createTrue() : factory.createFalse(),
        ),
      ]
    }
    return []
  })
  return properties.length === 0 ? [] : [factory.createObjectLiteralExpression(properties)]
}
