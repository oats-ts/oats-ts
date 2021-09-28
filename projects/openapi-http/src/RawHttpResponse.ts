import { RawHttpHeaders } from './RawHttpHeaders'

/** Object describing a Http request in a neutral format. */
export type RawHttpResponse = {
  url: string
  /** The response status code */
  statusCode: number
  /** Request body, should only be set for the appropriate method. */
  body?: any
  /** Headers, content-type will be filled by default */
  headers?: RawHttpHeaders
}
