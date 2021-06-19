import { ReferenceObject } from 'openapi3-ts'
import { factory, CallExpression, Identifier } from 'typescript'
import { Validators } from '../common/OatsPackages'
import { OpenAPIGeneratorContext } from '../typings'

export function getReferenceValidatorAst(
  data: ReferenceObject,
  context: OpenAPIGeneratorContext,
  references: boolean,
): CallExpression | Identifier {
  const { accessor } = context
  if (!references) {
    return factory.createIdentifier(Validators.any)
  }
  const resolved = accessor.dereference(data)
  return factory.createCallExpression(factory.createIdentifier(Validators.lazy), undefined, [
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
