import { RawHttpResponse } from '@oats-ts/openapi-http'
import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { NextFunction, Request, Response, Router } from 'express'
import { TestApi } from '../api/TestApi'
import { labelPathParametersPathDeserializer } from '../pathDeserializers/labelPathParametersPathDeserializer'
import { LabelPathParametersServerRequest } from '../requestServerTypes/LabelPathParametersServerRequest'

export const labelPathParametersRoute: Router = Router().get(
  '/label-path-params/:s/:se/:n/:ne/:b/:be/:e/:ee/:a/:ae/:o/:oe',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: TestApi<ExpressParameters> = response.locals['__oats_api']
    const [pathIssues, path] = await configuration.getPathParameters(
      frameworkInput,
      labelPathParametersPathDeserializer,
    )
    const issues = [...pathIssues]
    const typedRequest = {
      path,
      issues: issues.length > 0 ? issues : undefined,
    } as LabelPathParametersServerRequest
    const typedResponse = await api.labelPathParameters(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)
