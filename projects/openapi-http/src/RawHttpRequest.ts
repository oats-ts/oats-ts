import { HttpMethod } from './HttpMethod'
import { RawHttpHeaders } from './RawHttpHeaders'

/** Object describing a Http request in a neutral format. */
export type RawHttpRequest = {
  /** Full url with path, and query. */
  url: string
  method: HttpMethod
  /** Request body, should only be set for the appropriate method. */
  body?: any
  /** Headers, content-type will be filled by default */
  headers?: RawHttpHeaders
}
