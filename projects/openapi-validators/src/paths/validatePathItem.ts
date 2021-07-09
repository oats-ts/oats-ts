import { PathItemObject } from 'openapi3-ts'
import { isNil, flatMap } from 'lodash'
import { Issue, object, optional, shape, combine, array } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from '../append'
import { validateParameters } from '../parameters/validateParameters'
import { ignore } from '../ignore'
import { validateOperation } from '../operation/validateOperation'
import { getOperations } from './getOperations'

const validator = object(
  combine(
    shape<PathItemObject>(
      {
        get: optional(object()),
        put: optional(object()),
        post: optional(object()),
        delete: optional(object()),
        options: optional(object()),
        head: optional(object()),
        patch: optional(object()),
        parameters: optional(array()),
      },
      true,
    ),
    ignore(['$ref', 'servers']),
  ),
)

export const validatePathItem = (data: PathItemObject, context: OpenAPIGeneratorContext): Issue[] => {
  const { accessor } = context
  const { parameters } = data
  return [
    ...validator(data, { append, path: accessor.uri(data) }),
    ...flatMap(getOperations(data), (operation) => validateOperation(operation, context)),
    ...(isNil(parameters) ? [] : validateParameters(parameters, context)),
  ]
}
