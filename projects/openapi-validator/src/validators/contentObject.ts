import { ContentObject, MediaTypeObject } from 'openapi3-ts'
import { Issue, object, shape, combine, record, string } from '@oats-ts/validators'
import { entries, flatMap } from 'lodash'
import { append } from '../utils/append'
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
        shape<MediaTypeObject>({
          schema: object(),
        }),
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
    return ordered(() => validator(data, { append, path: uriOf(data) }))(() =>
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