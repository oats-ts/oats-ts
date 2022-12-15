/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/content-parameters.json (originating from oats-ts/oats-schemas)
 */

import {
  PathParameters,
  parameter,
  parsePathToMatcher,
  parsePathToSegments,
  validators,
} from '@oats-ts/openapi-runtime'
import { PathParametersPathParameters } from './pathTypes'
import { contentCommonEnumTypeTypeValidator, contentCommonObjectTypeTypeValidator } from './typeValidators'

export const pathParametersPathParameters: PathParameters<PathParametersPathParameters> = {
  descriptor: {
    str: parameter.path.required.schema('application/json'),
    num: parameter.path.required.schema('application/json'),
    bool: parameter.path.required.schema('application/json'),
    enm: parameter.path.required.schema('application/json'),
    strArr: parameter.path.required.schema('application/json'),
    numArr: parameter.path.required.schema('application/json'),
    boolArr: parameter.path.required.schema('application/json'),
    enmArr: parameter.path.required.schema('application/json'),
    obj: parameter.path.required.schema('application/json'),
  },
  schema: validators.object(
    validators.shape({
      bool: validators.boolean(),
      boolArr: validators.array(validators.items(validators.boolean())),
      enm: validators.lazy(() => contentCommonEnumTypeTypeValidator),
      enmArr: validators.array(validators.items(validators.lazy(() => contentCommonEnumTypeTypeValidator))),
      num: validators.number(),
      numArr: validators.array(validators.items(validators.number())),
      obj: validators.lazy(() => contentCommonObjectTypeTypeValidator),
      str: validators.string(),
      strArr: validators.array(validators.items(validators.string())),
    }),
  ),
  matcher: parsePathToMatcher('/path-parameters/{str}/{num}/{bool}/{enm}/{strArr}/{numArr}/{boolArr}/{enmArr}/{obj}'),
  pathSegments: parsePathToSegments(
    '/path-parameters/{str}/{num}/{bool}/{enm}/{strArr}/{numArr}/{boolArr}/{enmArr}/{obj}',
  ),
}