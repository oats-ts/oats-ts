import type { Issue } from '@oats-ts/validators'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { URIManipulatorType } from './typings'
import { Try } from '@oats-ts/try'

export type ReadContext = {
  documents: Map<string, OpenAPIObject>
  uriToObject: Map<string, any>
  objectToUri: Map<any, string>
  objectToName: Map<any, string>
  issues: Issue[]
  uri: URIManipulatorType
  resolve(uri: string): Promise<Try<OpenAPIObject>>
}

export type ReadInput<T> = {
  data: T
  uri: string
}
