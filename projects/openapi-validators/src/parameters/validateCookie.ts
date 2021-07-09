import { Issue } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ParameterObject } from 'openapi3-ts'
import { append } from '../append'

export function validateCookie(input: ParameterObject, context: OpenAPIGeneratorContext): Issue[] {
  return [
    {
      message: '"cookie" parameters are ignored.',
      path: append(context.accessor.uri(input), 'in'),
      severity: 'warning',
      type: 'other',
    },
  ]
}