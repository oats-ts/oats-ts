import { Referenceable } from '@oats-ts/json-schema-model'
import { BaseParameterObject, ParameterObject } from '@oats-ts/openapi-model'
import { isNil } from 'lodash'
import { OpenAPIGeneratorContext } from './typings'

export function getParameterName(
  parameter: Referenceable<BaseParameterObject>,
  context: OpenAPIGeneratorContext,
): string | undefined {
  if (isNil(parameter)) {
    return undefined
  }
  const { nameOf, dereference } = context
  const providedName = nameOf(parameter)
  if (!isNil(providedName)) {
    return providedName
  }
  const param = dereference(parameter, true) as ParameterObject
  return param?.name
}
