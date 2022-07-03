import { factory, Expression } from 'typescript'
import { RuntimePackages } from '@oats-ts/model-common'
import { entries } from 'lodash'
import { safeName } from '@oats-ts/typescript-common'

function primitiveValidator(literal: Expression): Expression {
  return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.literal), [], [literal])
}

function objectValidator(data: Record<string, any>) {
  const properties = entries(data).map(([key, value]) =>
    factory.createPropertyAssignment(safeName(key), getJsonLiteralValidatorAst(value)),
  )
  return factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Validators.object),
    [],
    [
      factory.createCallExpression(
        factory.createIdentifier(RuntimePackages.Validators.shape),
        [],
        [factory.createObjectLiteralExpression(properties, properties.length > 1)],
      ),
    ],
  )
}

function arrayValidator(data: any[]) {
  const parameters = data.map((value) => getJsonLiteralValidatorAst(value))
  return factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Validators.array),
    [],
    [factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.tuple), [], parameters)],
  )
}

export function getJsonLiteralValidatorAst(data: any): Expression {
  if (data === null) {
    return primitiveValidator(factory.createNull())
  } else if (typeof data === 'string') {
    return primitiveValidator(factory.createStringLiteral(data))
  } else if (typeof data === 'number') {
    return primitiveValidator(factory.createNumericLiteral(data))
  } else if (typeof data === 'boolean') {
    return primitiveValidator(data ? factory.createTrue() : factory.createFalse())
  } else if (Array.isArray(data)) {
    return arrayValidator(data)
  } else if (typeof data === 'object') {
    return objectValidator(data)
  }
  return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.any), [], [])
}
