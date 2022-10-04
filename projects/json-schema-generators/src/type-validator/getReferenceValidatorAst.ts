import { ReferenceObject } from '@oats-ts/json-schema-model'
import { RuntimePackages } from '@oats-ts/model-common'
import { factory, Expression } from 'typescript'
import { ValidatorsGeneratorConfig } from './typings'
import { isNil } from 'lodash'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { JsonSchemaGeneratorContext } from '../types'

export function getReferenceValidatorAst(
  data: ReferenceObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
): Expression {
  const resolved = context.dereference(data)
  const name = context.nameOf(resolved, 'oats/type-validator')
  if (!isNil(name)) {
    const validator = factory.createIdentifier(name)
    return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.lazy), undefined, [
      factory.createArrowFunction([], [], [], undefined, undefined, validator),
    ])
  }
  return getRightHandSideValidatorAst(resolved, context, config)
}
