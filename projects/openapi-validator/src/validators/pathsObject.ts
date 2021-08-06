import { PathsObject } from '@oats-ts/openapi-model'
import { Issue, object, record, string } from '@oats-ts/validators'
import { append } from '../utils/append'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { flatMap, entries } from 'lodash'
import { pathItemObjectUrl } from './pathItemObjectUrl'
import { ifNotValidated } from '../utils/ifNotValidated'

const validator = object(record(string(), object()))

export function pathsObject(
  data: PathsObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() => {
    const { pathItemObject } = config
    const { uriOf } = context
    return ordered(() => validator(data, { append, path: uriOf(data) }))(() =>
      flatMap(entries(data), ([url, pathObj]) =>
        ordered(() => pathItemObject(pathObj, context, config))(() => pathItemObjectUrl(url, pathObj, context, config)),
      ),
    )
  })
}
