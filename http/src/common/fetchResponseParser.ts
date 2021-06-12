import { asHttpHeaders } from './asHttpHeaders'
import { ResponseLike } from './typings'
import { ContentValidator, HttpResponse, ResponseParserHint } from '../typings'

async function getResponseBody(response: ResponseLike, contentType: string): Promise<any> {
  switch (contentType) {
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

export async function fetchResponseParser(response: ResponseLike, hint: ResponseParserHint): Promise<HttpResponse> {
  const { status: statusCode, url, headers } = response
  const hintForStatus = hint[statusCode] || hint.default
  if (hintForStatus === undefined || hintForStatus === null) {
    // TODO more descriptive error
    throw new TypeError(`Unexpected status code: "${statusCode}".`)
  }
  if (!headers.has('content-type')) {
    throw new Error('Expected content-type header to be present.')
  }
  // TODO check if casing matters.
  const contentType = headers.get('content-type')
  if (!Object.prototype.hasOwnProperty.apply(hintForStatus, contentType)) {
    throw new Error(`Unexpected value for "content-type" header: "${contentType}"`)
  }
  const body = await getResponseBody(response, contentType)
  const validator = hintForStatus[contentType]
  validateResponseBody(body, validator)

  return {
    url,
    body,
    statusCode,
    headers: asHttpHeaders(headers),
  }
}
