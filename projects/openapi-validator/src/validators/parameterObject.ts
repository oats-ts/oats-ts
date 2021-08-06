import { Issue } from '@oats-ts/validators'
import { ParameterObject } from '@oats-ts/openapi-model'
import { cookieParameterObject } from './cookieParameterObject'
import { headerParameterObject } from './headerParameterObject'
import { pathParameterObject } from './pathParameterObject'
import { queryParameterObject } from './queryParameterObject'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'

export function parameterObject(
  data: ParameterObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() => {
    switch (data.in) {
      case 'cookie':
        return cookieParameterObject(data, context, config)
      case 'header':
        return headerParameterObject(data, context, config)
      case 'path':
        return pathParameterObject(data, context, config)
      case 'query':
        return queryParameterObject(data, context, config)
      default:
        return []
    }
  })
}
