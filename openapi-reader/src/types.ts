import { Issue } from '@oats-ts/validators'
import { OpenAPIObject } from 'openapi3-ts'
import { URIManipulator } from '../types/URIManipulator'

export type ReadContext = {
  documents: Map<string, OpenAPIObject>
  byUri: Map<string, any>
  byComponent: Map<any, string>
  issues: Issue[]
  uri: URIManipulator
  resolve(uri: string): Promise<OpenAPIObject>
}

export type ReadInput<T> = {
  data: T
  uri: string
}
