import { isNil } from 'lodash'
import { BaseParameterObject, ParameterObject, ParameterStyle } from '@oats-ts/openapi-model'

export function getParameterStyle(parameter: BaseParameterObject): ParameterStyle {
  const _in = (parameter as ParameterObject).in
  if (isNil(_in)) {
    return isNil(parameter.style) ? 'simple' : parameter.style
  }
  switch (_in) {
    case 'header':
      return isNil(parameter.style) ? 'simple' : parameter.style
    case 'path':
      return isNil(parameter.style) ? 'simple' : parameter.style
    case 'query':
      return isNil(parameter.style) ? 'form' : parameter.style
    case 'cookie':
      return isNil(parameter.style) ? 'form' : parameter.style
  }
}
