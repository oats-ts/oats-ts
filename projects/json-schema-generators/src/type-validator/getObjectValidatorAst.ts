import { entries, has, sortBy } from 'lodash'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, CallExpression, Identifier } from 'typescript'
import { getDiscriminators } from '@oats-ts/model-common'
import { RuntimePackages } from '@oats-ts/model-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'
import { safeName } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext } from '../types'

export function getObjectValidatorAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
): CallExpression | Identifier {
  const discriminators = getDiscriminators(data, context) || {}
  const discriminatorProperties = sortBy(entries(discriminators), ([name]) => name).map(([name, value]) =>
    factory.createPropertyAssignment(
      safeName(name),
      factory.createCallExpression(
        factory.createIdentifier(RuntimePackages.Validators.literal),
        [],
        [factory.createStringLiteral(value)],
      ),
    ),
  )

  const basicProperties = sortBy(entries(data.properties || {}), ([name]) => name)
    .filter(([name]) => !has(discriminators, name))
    .map(([name, schema]) => {
      const isOptional = (data.required || []).indexOf(name) < 0
      const rhs = getRightHandSideValidatorAst(schema, context, config)
      const value = isOptional
        ? factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.optional), [], [rhs])
        : rhs
      return factory.createPropertyAssignment(safeName(name), value)
    })

  const properties = discriminatorProperties.concat(basicProperties)

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
