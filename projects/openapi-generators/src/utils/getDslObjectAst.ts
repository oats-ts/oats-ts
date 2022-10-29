import { BaseParameterObject, ParameterObject } from '@oats-ts/openapi-model'
import { getParameterKind, getParameterName, getParameterStyle, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { entries, flatMap, has, isNil, negate } from 'lodash'
import { Expression, factory, ObjectLiteralExpression, PropertyAccessExpression, PropertyAssignment } from 'typescript'
import { isIdentifier, getLiteralAst } from '@oats-ts/typescript-common'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { getInferredType, OpenApiParameterSerializationPackage } from '@oats-ts/model-common'

export function getDslObjectAst(
  parameters: Referenceable<BaseParameterObject>[],
  context: OpenAPIGeneratorContext,
  paramsPkg: OpenApiParameterSerializationPackage,
): ObjectLiteralExpression {
  return factory.createObjectLiteralExpression(
    parameters
      .map((parameter) => getParameterDsl(parameter, context, paramsPkg))
      .filter(negate(isNil)) as PropertyAssignment[],
  )
}

function getParameterDsl(
  param: Referenceable<BaseParameterObject>,
  context: OpenAPIGeneratorContext,
  paramsPkg: OpenApiParameterSerializationPackage,
): PropertyAssignment | undefined {
  const name = getParameterName(param, context)
  const parameter = context.dereference(param, true)
  const schema = context.dereference(parameter.schema)
  if (isNil(schema) || isNil(name)) {
    return undefined
  }
  const kind = getParameterKind(schema)
  const { in: location = 'header' } = parameter as ParameterObject

  return factory.createPropertyAssignment(
    isIdentifier(name) ? name : factory.createStringLiteral(name),
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(paramsPkg.exports.dsl),
            factory.createIdentifier(location),
          ),
          factory.createIdentifier(getParameterStyle(parameter)),
        ),
        factory.createIdentifier(kind),
      ),
      [],
      [getTypeDsl(schema, context, paramsPkg), ...getDslOptions(parameter)],
    ),
  )
}

function getTypeDsl(
  schemaOrRef: Referenceable<SchemaObject> | undefined,
  context: OpenAPIGeneratorContext,
  paramsPkg: OpenApiParameterSerializationPackage,
): Expression {
  const schema = context.dereference(schemaOrRef, true)
  if (isNil(schema)) {
    return factory.createIdentifier('undefined')
  }
  const inferredType = getInferredType(schema)
  switch (inferredType) {
    case 'string':
    case 'number':
    case 'boolean': {
      return factory.createCallExpression(valueAccess(inferredType, context, paramsPkg), [], [])
    }
    case 'enum': {
      const type = schema.type === 'number' || schema.type === 'integer' ? 'number' : 'string'
      return factory.createCallExpression(
        valueAccess(type, context, paramsPkg),
        [],
        [
          factory.createCallExpression(valueAccess('enum', context, paramsPkg), undefined, [
            factory.createArrayLiteralExpression((schema.enum ?? []).map((v) => getLiteralAst(v))),
          ]),
        ],
      )
    }
    case 'array': {
      if (typeof schema.items !== 'boolean') {
        return getTypeDsl(schema.items, context, paramsPkg)
      }
      return factory.createIdentifier('undefined')
    }
    case 'object': {
      const properties = entries(schema.properties).map(([name, propSchema]) => {
        const isRequired = (schema.required || []).indexOf(name) >= 0
        const typeDsl = getTypeDsl(propSchema, context, paramsPkg)
        return factory.createPropertyAssignment(
          isIdentifier(name) ? name : factory.createStringLiteral(name),
          isRequired
            ? typeDsl
            : factory.createCallExpression(valueAccess('optional', context, paramsPkg), [], [typeDsl]),
        )
      })
      return factory.createObjectLiteralExpression(properties)
    }
    default:
      return factory.createIdentifier('undefined')
  }
}

function valueAccess(
  field: string,
  context: OpenAPIGeneratorContext,
  paramsPkg: OpenApiParameterSerializationPackage,
): PropertyAccessExpression {
  return factory.createPropertyAccessExpression(
    factory.createPropertyAccessExpression(
      factory.createIdentifier(paramsPkg.exports.dsl),
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
