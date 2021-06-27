import { ReferenceObject } from 'openapi3-ts'
import { factory, CallExpression, Identifier } from 'typescript'
import { RuntimePackages, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ValidatorsGeneratorConfig } from './typings'

export function getReferenceValidatorAst(
  data: ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
): CallExpression | Identifier {
  const { accessor } = context
  if (!config.references) {
    return factory.createIdentifier(RuntimePackages.Validators.any)
  }
  const resolved = accessor.dereference(data)
  return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.lazy), undefined, [
    factory.createArrowFunction(
      [],
      [],
      [],
      undefined,
      undefined,
      factory.createIdentifier(accessor.name(resolved, 'validator')),
    ),
  ])
}
