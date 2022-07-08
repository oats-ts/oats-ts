import { ContentObject, MediaTypeObject } from '@oats-ts/openapi-model'
import { Issue, object, shape, combine, record, string } from '@oats-ts/validators'
import { entries, flatMap } from 'lodash'
import { validatorConfig } from '../utils/validatorConfig'
import { ignore } from '../utils/ignore'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'

const validator = object(
  record(
    string(),
    object(
      combine(
        shape<MediaTypeObject>(
          {
            schema: object(),
          },
          true,
        ),
        ignore(['encoding']),
      ),
    ),
  ),
)

export function contentObject(
  data: ContentObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() => {
    const { uriOf } = context
    const { schemaObject } = config
    return ordered(() => validator(data, uriOf(data), validatorConfig))(() =>
      flatMap(entries(data), ([contentType, mediaType]): Issue[] => {
        const issues: Issue[] = []
        if (contentType !== 'application/json') {
          issues.push({
            message: `MIME type "${contentType}" might not be compatible with JSON schema`,
            path: uriOf(mediaType),
            severity: 'warning',
            type: 'other',
          })
        }
        issues.push(...referenceable(schemaObject)(mediaType.schema, context, config))
        return issues
      }),
    )
  })
}
