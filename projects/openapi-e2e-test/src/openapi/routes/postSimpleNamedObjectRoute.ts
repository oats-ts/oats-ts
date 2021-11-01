import { RawHttpResponse } from '@oats-ts/openapi-http'
import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { NextFunction, Request, Response, Router } from 'express'
import { Api } from '../api/Api'
import { postSimpleNamedObjectRequestBodyValidator } from '../requestBodyValidators/postSimpleNamedObjectRequestBodyValidator'
import { PostSimpleNamedObjectServerRequest } from '../requestServerTypes/PostSimpleNamedObjectServerRequest'

export const postSimpleNamedObjectRoute: Router = Router().post(
  '/simple-named-object',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: Api<ExpressParameters> = response.locals['__oats_api']
    const [mimeTypeIssues, mimeType] = await configuration.getMimeType(
      frameworkInput,
      postSimpleNamedObjectRequestBodyValidator,
    )
    const [bodyIssues, body] = await configuration.getRequestBody(
      frameworkInput,
      mimeType,
      postSimpleNamedObjectRequestBodyValidator,
    )
    const issues = [...mimeTypeIssues, ...bodyIssues]
    const typedRequest = {
      mimeType,
      body,
      issues: issues.length > 0 ? issues : undefined,
    } as PostSimpleNamedObjectServerRequest
    const typedResponse = await api.postSimpleNamedObject(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)
