import type { Issue } from '@oats-ts/validators'
import { OpenAPIObject } from 'openapi3-ts'
import { URIManipulator } from './typings'

export type ReadContext = {
  documents: Map<string, OpenAPIObject>
  uriToObject: Map<string, any>
  objectToUri: Map<any, string>
  objectToName: Map<any, string>
  issues: Issue[]
  uri: URIManipulator
  resolve(uri: string): Promise<OpenAPIObject>
}

export type ReadInput<T> = {
  data: T
  uri: string
}
