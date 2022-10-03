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
  const providedName = context.nameOf(parameter)
  if (!isNil(providedName)) {
    return providedName
  }
  const param = context.dereference(parameter, true) as ParameterObject
  return param?.name
}
