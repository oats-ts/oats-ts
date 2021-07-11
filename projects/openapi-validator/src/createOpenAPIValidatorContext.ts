import { dereference, uriOf } from '@oats-ts/openapi-common'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OpenAPIValidatorContext } from './typings'

export function createOpenAPIValidatorContext(data: OpenAPIReadOutput): OpenAPIValidatorContext {
  return {
    document: data.document,
    documents: Array.from(data.documents.values()),
    validated: new Set(),
    dereference: dereference(data),
    nameOf: (input: any) => data.objectToName.get(input),
    uriOf: uriOf(data),
  }
}
