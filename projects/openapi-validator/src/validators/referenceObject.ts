import { OpenAPIValidatorConfig, OpenAPIValidatorContext, OpenAPIValidatorFn } from '../typings'
import { ReferenceObject } from 'openapi3-ts'
import { Issue, object, shape, string } from '@oats-ts/validators'
import { ifNotValidated } from '../utils/ifNotValidated'
import { ordered } from '../utils/ordered'
import { append } from '../utils/append'

const validator = object(shape<ReferenceObject>({ $ref: string() }))

export function referenceObject(
  input: ReferenceObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    input,
  )(() => {
    const { uriOf } = context
    return ordered(() => validator(input, { append, path: uriOf(input) }))()
  })
}
