import { ContentObject, MediaTypeObject } from 'openapi3-ts'
import { Issue, object, shape, combine, record, string } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { entries, flatMap } from 'lodash'
import { append } from '../append'
import { validateSchema } from '../schema/validateSchema'
import { ignore } from '../ignore'

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

export const validateContent = (data: ContentObject, context: OpenAPIGeneratorContext): Issue[] => {
  const { accessor } = context
  const structuralIssues = validator(data, { append, path: accessor.uri(data) })
  if (structuralIssues.some((issue) => issue.severity === 'error')) {
    return structuralIssues
  }

  return flatMap(entries(data), ([contentType, mediaType]): Issue[] => {
    const issues: Issue[] = []
    if (contentType !== 'application/json') {
      issues.push({
        message: `MIME type "${contentType}" might not be compatible with JSON schema`,
        path: accessor.uri(mediaType),
        severity: 'warning',
        type: 'other',
      })
    }
    issues.push(...validateSchema(mediaType.schema, context, new Set()))
    return issues
  })
}
