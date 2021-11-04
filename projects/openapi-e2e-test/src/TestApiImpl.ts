import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { TestApi } from './openapi/api/TestApi'
import { LabelPathParametersServerRequest } from './openapi/requestServerTypes/LabelPathParametersServerRequest'
import { MatrixPathParametersServerRequest } from './openapi/requestServerTypes/MatrixPathParametersServerRequest'
import { SimplePathParametersServerRequest } from './openapi/requestServerTypes/SimplePathParametersServerRequest'
import { LabelPathParametersResponse } from './openapi/responseTypes/LabelPathParametersResponse'
import { MatrixPathParametersResponse } from './openapi/responseTypes/MatrixPathParametersResponse'
import { SimplePathParametersResponse } from './openapi/responseTypes/SimplePathParametersResponse'

export class TestApiImpl implements TestApi<ExpressParameters> {
  pathParameterResponse(input: SimplePathParametersServerRequest): SimplePathParametersResponse {
    if (input.issues) {
      return {
        mimeType: 'application/json',
        statusCode: 400,
        headers: undefined,
        body: input.issues.map((issue) => ({ message: issue.message })),
      }
    }
    return {
      mimeType: 'application/json',
      statusCode: 200,
      headers: undefined,
      body: input.path,
    }
  }

  async labelPathParameters(input: LabelPathParametersServerRequest): Promise<LabelPathParametersResponse> {
    return this.pathParameterResponse(input)
  }
  async simplePathParameters(input: SimplePathParametersServerRequest): Promise<SimplePathParametersResponse> {
    return this.pathParameterResponse(input)
  }
  async matrixPathParameters(input: MatrixPathParametersServerRequest): Promise<MatrixPathParametersResponse> {
    return this.pathParameterResponse(input)
  }
}
