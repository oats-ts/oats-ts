import { isNil } from 'lodash'
import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { factory, CallExpression, Identifier } from 'typescript'
import { RuntimePackages, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getObjectValidatorAst } from './getObjectValidatorAst'
import { getRecordValidatorAst } from './getRecordValidatorAst'
import { getReferenceValidatorAst } from './getReferenceValidatorAst'
import { getUnionTypeValidatorAst } from './getUnionTypeValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'
import { getLiteralAst } from '@oats-ts/typescript-common'

export function getRightHandSideValidatorAst(
  data: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
): CallExpression | Identifier {
  const { accessor } = context
  if (isReferenceObject(data)) {
    return getReferenceValidatorAst(data, context, config)
  }

  if (!isNil(data.oneOf)) {
    return getUnionTypeValidatorAst(data, context, config)
  }

  if (!isNil(data.enum)) {
    return factory.createCallExpression(
      factory.createIdentifier(RuntimePackages.Validators.enumeration),
      [],
      [factory.createArrayLiteralExpression(data.enum.map((value) => getLiteralAst(value)))],
    )
  }

  if (data.type === 'string') {
    return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.string), [], [])
  }

  if (data.type === 'number' || data.type === 'integer') {
    return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.number), [], [])
  }

  if (data.type === 'boolean') {
    return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.boolean), [], [])
  }

  if (!isNil(data.additionalProperties) && typeof data.additionalProperties !== 'boolean') {
    return getRecordValidatorAst(data, context, config)
  }

  if (!isNil(data.properties)) {
    return getObjectValidatorAst(data, context, config)
  }

  if (!isNil(data.items)) {
    return factory.createCallExpression(
      factory.createIdentifier(RuntimePackages.Validators.array),
      [],
      [getRightHandSideValidatorAst(data.items, context, config)],
    )
  }

  return factory.createIdentifier(RuntimePackages.Validators.any)
}
