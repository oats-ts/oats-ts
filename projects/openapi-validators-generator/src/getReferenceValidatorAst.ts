import { ReferenceObject } from 'openapi3-ts'
import { factory, CallExpression, Identifier } from 'typescript'
import { RuntimePackages, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ValidatorsGeneratorConfig } from './typings'
import { isNil } from 'lodash'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'

export function getReferenceValidatorAst(
  data: ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
  lazy: boolean = true,
  force: boolean = false,
): CallExpression | Identifier {
  const { accessor } = context
  if (!config.references && !force) {
    return factory.createIdentifier(RuntimePackages.Validators.any)
  }
  const resolved = accessor.dereference(data)
  const name = accessor.name(resolved, 'openapi/validator')
  if (!isNil(name)) {
    const validator = factory.createIdentifier(name)
    if (lazy) {
      return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.lazy), undefined, [
        factory.createArrowFunction([], [], [], undefined, undefined, validator),
      ])
    }
    return validator
  }
  return getRightHandSideValidatorAst(resolved, context, config)
}
