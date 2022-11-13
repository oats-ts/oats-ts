import { PathsObject } from '@oats-ts/openapi-model'
import { Issue } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { flatMap, entries } from 'lodash'
import { pathItemObjectUrl } from './pathItemObjectUrl'
import { ifNotValidated } from '../utils/ifNotValidated'
import { structural } from '../structural'

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
    return ordered(() => structural.pathsObject(data, context.uriOf(data), validatorConfig))(() =>
      flatMap(entries(data), ([url, pathObj]) =>
        ordered(() => pathItemObject(pathObj, context, config))(() => pathItemObjectUrl(url, pathObj, context, config)),
      ),
    )
  })
}
