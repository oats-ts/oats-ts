import { ReferenceObject } from '@oats-ts/json-schema-model'
import { RuntimePackages } from '@oats-ts/model-common'
import { factory, CallExpression, Identifier } from 'typescript'
import { ValidatorsGeneratorConfig, ValidatorsGeneratorContext } from './typings'
import { isNil } from 'lodash'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'

export function getReferenceValidatorAst(
  data: ReferenceObject,
  context: ValidatorsGeneratorContext,
  config: ValidatorsGeneratorConfig,
  level: number,
): CallExpression | Identifier {
  const { dereference, nameOf } = context
  if (!config.references && level > 0) {
    return factory.createIdentifier(RuntimePackages.Validators.any)
  }
  const resolved = dereference(data)
  const name = nameOf(resolved, context.produces)
  if (!isNil(name)) {
    const validator = factory.createIdentifier(name)
    return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.lazy), undefined, [
      factory.createArrowFunction([], [], [], undefined, undefined, validator),
    ])
  }
  return getRightHandSideValidatorAst(resolved, context, config, level)
}