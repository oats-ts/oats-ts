import { isNil } from 'lodash'
import { ParameterObject, ParameterStyle } from '@oats-ts/openapi-model'

export function getParameterStyle(parameter: ParameterObject): ParameterStyle {
  switch (parameter.in) {
    case 'header':
      return isNil(parameter.style) ? 'simple' : parameter.style
    case 'path':
      return isNil(parameter.style) ? 'simple' : parameter.style
    case 'query':
      return isNil(parameter.style) ? 'form' : parameter.style
    default:
      return undefined
  }
}
