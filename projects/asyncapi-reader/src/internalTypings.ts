import type { Issue } from '@oats-ts/validators'
import { AsyncApiObject } from '@oats-ts/asyncapi-model'
import { URIManipulator } from './typings'

export type ReadContext = {
  documents: Map<string, AsyncApiObject>
  uriToObject: Map<string, any>
  objectToUri: Map<any, string>
  objectToName: Map<any, string>
  issues: Issue[]
  uri: URIManipulator
  resolve(uri: string): Promise<AsyncApiObject>
}

export type ReadInput<T> = {
  data: T
  uri: string
}
