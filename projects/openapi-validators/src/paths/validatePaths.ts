import { PathsObject } from 'openapi3-ts'
import { Issue, object, record, string } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from '../append'
import { entries, flatMap } from 'lodash'
import { validateUrl } from './validateUrl'
import { validatePathItem } from './validatePathItem'

const validator = object(record(string(), object()))

export const validatePaths = (data: PathsObject, context: OpenAPIGeneratorContext): Issue[] => {
  const { accessor } = context
  return [
    ...flatMap(entries(data), ([url, pathObj]) => {
      return [...validateUrl(url, pathObj, context), ...validatePathItem(pathObj, context)]
    }),
    ...validator(data, { append, path: accessor.uri(data) }),
  ]
}
