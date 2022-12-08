import { ContentValidator } from '@oats-ts/oats-ts'
import { OpenAPIReadOutput } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { OpenAPIValidator } from './OpenAPIValidator'

export function validator(): ContentValidator<OpenAPIObject, OpenAPIReadOutput> {
  return new OpenAPIValidator()
}
