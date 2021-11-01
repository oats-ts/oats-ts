import { RawHttpResponse } from '@oats-ts/openapi-http'
import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { NextFunction, Request, Response, Router } from 'express'
import { Api } from '../api/Api'
import { sampleOperationPathDeserializer } from '../pathDeserializers/sampleOperationPathDeserializer'
import { sampleOperationQueryDeserializer } from '../queryDeserializers/sampleOperationQueryDeserializer'
import { sampleOperationRequestBodyValidator } from '../requestBodyValidators/sampleOperationRequestBodyValidator'
import { sampleOperationRequestHeadersDeserializer } from '../requestHeaderDeserializers/sampleOperationRequestHeadersDeserializer'
import { SampleOperationServerRequest } from '../requestServerTypes/SampleOperationServerRequest'
import { sampleOperationResponseHeaderSerializer } from '../responseHeaderSerializers/sampleOperationResponseHeaderSerializer'

export const sampleOperationRoute: Router = Router().post(
  '/sample/path/:pathParam',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: Api<ExpressParameters> = response.locals['__oats_api']
    const [pathIssues, path] = await configuration.getPathParameters(frameworkInput, sampleOperationPathDeserializer)
    const [queryIssues, query] = await configuration.getQueryParameters(
      frameworkInput,
      sampleOperationQueryDeserializer,
    )
    const [headerIssues, headers] = await configuration.getRequestHeaders(
      frameworkInput,
      sampleOperationRequestHeadersDeserializer,
    )
    const [mimeTypeIssues, mimeType] = await configuration.getMimeType(
      frameworkInput,
      sampleOperationRequestBodyValidator,
    )
    const [bodyIssues, body] = await configuration.getRequestBody(
      frameworkInput,
      mimeType,
      sampleOperationRequestBodyValidator,
    )
    const issues = [...pathIssues, ...queryIssues, ...headerIssues, ...mimeTypeIssues, ...bodyIssues]
    const typedRequest = {
      path,
      query,
      headers,
      mimeType,
      body,
      issues: issues.length > 0 ? issues : undefined,
    } as SampleOperationServerRequest
    const typedResponse = await api.sampleOperation(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(
        frameworkInput,
        typedResponse,
        sampleOperationResponseHeaderSerializer,
      ),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)
