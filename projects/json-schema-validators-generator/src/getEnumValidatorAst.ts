import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, CallExpression, Identifier, Expression } from 'typescript'
import { RuntimePackages } from '@oats-ts/model-common'
import { safeName } from '@oats-ts/typescript-common'
import { getJsonLiteralValidatorAst } from './getJsonLiteralValidatorAst'

function isPrimitive(value: any) {
  return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number'
}

function keyOf(value: any) {
  if (value === null) {
    return safeName('null')
  } else if (isPrimitive(value)) {
    return safeName(`${value}`)
  }
  return safeName(JSON.stringify(value))
}

export function getEnumValidatorAst(data: SchemaObject): Expression {
  const { enum: values = [] } = data
  if (values.length === 1) {
    return getJsonLiteralValidatorAst(values[0])
  }
  const properties = values.map((value) =>
    factory.createPropertyAssignment(keyOf(value), getJsonLiteralValidatorAst(value)),
  )
  const parameters = factory.createObjectLiteralExpression(properties, properties.length > 1)
  return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.union), [], [parameters])
}
