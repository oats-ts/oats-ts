import { ContentObject, MediaTypeObject } from '@oats-ts/openapi-model'
import { Issue, object, shape, combine, record, string, ShapeInput, restrictKeys } from '@oats-ts/validators'
import { entries, flatMap } from 'lodash'
import { validatorConfig } from '../utils/validatorConfig'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'

const medieTypeShape: ShapeInput<MediaTypeObject> = {
  schema: object(),
}

const validator = object(
  record(string(), object(combine(shape<MediaTypeObject>(medieTypeShape), restrictKeys(Object.keys(medieTypeShape))))),
)

export function contentObject(
  data: ContentObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() =>
    ordered(() => validator(data, context.uriOf(data), validatorConfig))(() =>
      flatMap(entries(data), ([contentType, mediaType]): Issue[] => {
        const issues: Issue[] = []
        if (contentType !== 'application/json') {
          issues.push({
            message: `MIME type "${contentType}" might not be compatible with JSON schema`,
            path: context.uriOf(mediaType),
            severity: 'warning',
          })
        }
        issues.push(...referenceable(config.schemaObject)(mediaType.schema!, context, config))
        return issues
      }),
    ),
  )
}
