import { entries, has, sortBy } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { factory, CallExpression, Identifier } from 'typescript'
import { getDiscriminators } from '../common/getDiscriminators'
import { Validators } from '../common/OatsPackages'
import { tsIdAst } from '../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '../typings'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'

export function getObjectValidatorAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  references: boolean,
): CallExpression | Identifier {
  const discriminators = getDiscriminators(data, context) || {}
  const discriminatorProperties = sortBy(entries(discriminators), ([name]) => name).map(([name, value]) =>
    factory.createPropertyAssignment(
      tsIdAst(name),
      factory.createCallExpression(
        factory.createIdentifier(Validators.literal),
        [],
        [factory.createStringLiteral(value)],
      ),
    ),
  )

  const basicProperties = sortBy(entries(data.properties || {}), ([name]) => name)
    .filter(([name]) => !has(discriminators, name))
    .map(([name, schema]) => {
      const isOptional = (data.required || []).indexOf(name) < 0
      const rhs = getRightHandSideValidatorAst(schema, context, references)
      const value = isOptional
        ? factory.createCallExpression(factory.createIdentifier(Validators.optional), [], [rhs])
        : rhs
      return factory.createPropertyAssignment(tsIdAst(name), value)
    })

  const properties = discriminatorProperties.concat(basicProperties)

  return factory.createCallExpression(
    factory.createIdentifier(Validators.object),
    [],
    [
      factory.createCallExpression(
        factory.createIdentifier(Validators.shape),
        [],
        [factory.createObjectLiteralExpression(properties, properties.length > 1)],
      ),
    ],
  )
}
