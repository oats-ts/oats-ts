import { Issue } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ParameterObject, ReferenceObject } from 'openapi3-ts'
import { flatMap } from 'lodash'
import { validateParameter } from './validateParameter'

export function validateParameters(
  input: (ParameterObject | ReferenceObject)[],
  context: OpenAPIGeneratorContext,
): Issue[] {
  return flatMap(input, (param) => validateParameter(param, context))
}
