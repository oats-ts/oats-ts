import { asHttpHeaders } from './asHttpHeaders'
import { ResponseLike } from './typings'
import { ContentValidator, HttpResponse, ResponseParserHint, StatusCode } from '../typings'
import MIMEType from 'whatwg-mimetype'

/* TODO could be expanded to handle more content types, but no use case for now. */
async function getResponseBody(response: ResponseLike, contentType: string): Promise<any> {
  switch (new MIMEType(contentType).essence) {
    case 'application/json':
      return response.json()
    case 'text/plain':
      return response.text()
    default:
      return response.blob()
  }
}

function validateResponseBody(body: any, validator: ContentValidator): void {
  if (validator === undefined || validator === null) {
    return
  }
  validator(body)
}

const hasOwnProperty = Object.prototype.hasOwnProperty

export async function fetchResponseParser(response: ResponseLike, hint: ResponseParserHint): Promise<HttpResponse> {
  const { status: statusCode, url, headers } = response
  const hintForStatus = hint[statusCode] || hint.default
  if (hintForStatus === undefined || hintForStatus === null) {
    // TODO more descriptive error
    throw new Error(`Unexpected status code: "${statusCode}".`)
  }
  if (!headers.has('content-type')) {
    throw new Error('Expected content-type header to be present.')
  }
  // TODO check if casing matters.
  const contentType = headers.get('content-type')
  if (contentType === null || contentType === undefined) {
    throw new TypeError(`Header content-type expected to be defined.`)
  }

  const mimeType = new MIMEType(contentType)

  if (!hasOwnProperty.call(hintForStatus, mimeType.essence)) {
    throw new Error(`Unexpected value for "content-type" header: "${contentType}"`)
  }

  const body = await getResponseBody(response, contentType)
  const validator = hintForStatus[mimeType.essence]
  validateResponseBody(body, validator)

  return {
    url,
    body,
    statusCode: statusCode as StatusCode,
    headers: asHttpHeaders(headers),
  }
}
