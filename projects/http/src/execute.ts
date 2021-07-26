import { HttpRequest, HttpResponse, RequestConfig, ResponseExpectations } from './typings'

const hasOwnProperty = Object.prototype.hasOwnProperty

function getResponseValidator(statusCode: number, mimeType: string, expectations?: ResponseExpectations): any {
  // If expectations not provided, return undefined, nothing to validate.
  if (expectations === null || expectations === undefined) {
    return undefined
  }

  const expectation = expectations[statusCode] || expectations.default

  // In case the status code returned by the server was not found among the expectations, throw.
  if (expectation === undefined || expectation === null) {
    const statusCodes = Object.keys(expectations)
    const statusCodesHint =
      statusCodes.length === 1
        ? `Expected "${statusCodes[0]}".`
        : `Expected one of ${statusCodes.map((code) => `"${code}"`).join(',')}`
    throw new Error(`Unexpected status code: "${statusCode}". ${statusCodesHint}`)
  }

  // In case the mime type returned by the server was not found amount expectations, throw.
  if (!hasOwnProperty.call(expectation, mimeType)) {
    const mimeTypes = Object.keys(expectations)
    const mimeTypesHint =
      mimeTypes.length === 1
        ? `Expected "${mimeTypes[0]}".`
        : `Expected one of ${mimeTypes.map((type) => `"${type}"`).join(',')}`
    throw new Error(`Unexpected mime type: "${mimeType}". ${mimeTypesHint}`)
  }

  return expectation[mimeType]
}

export async function execute(
  request: HttpRequest,
  config: RequestConfig,
  expectations?: ResponseExpectations,
): Promise<HttpResponse> {
  const response = await config.request(request)
  const statusCode = await config.statusCode(response)
  const mimeType = await config.mimeType(response)
  const headers = await config.headers(response)
  const validator = getResponseValidator(statusCode, mimeType, expectations)
  const body = await config.body(response, mimeType)

  if (validator !== null && validator !== undefined) {
    config.validate(body, validator)
  }

  return {
    body,
    headers,
    mimeType,
    statusCode,
    url: request.url,
  }
}
