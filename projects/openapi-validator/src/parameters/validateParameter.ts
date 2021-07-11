import { Issue } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ParameterObject, ReferenceObject } from 'openapi3-ts'
import { validateCookie } from './validateCookie'
import { validateHeader } from './validateHeader'
import { validatePath } from './validatePath'
import { validateQuery } from './validateQuery'

export function validateParameter(input: ParameterObject | ReferenceObject, context: OpenAPIGeneratorContext): Issue[] {
  const { dereference } = context
  const param = dereference(input)
  switch (param.in) {
    case 'cookie':
      return validateCookie(param, context)
    case 'header':
      return validateHeader(param, context)
    case 'path':
      return validatePath(param, context)
    case 'query':
      return validateQuery(param, context)
    default:
      return []
  }
}
