import express from 'express'
import { ExpressParameters, ExpressServerConfiguration } from '@oats-ts/openapi-http-server/lib/express'
import { createMainRoute } from './openapi/routes/createMainRoute'
import { Api } from './openapi/api/Api'
import { GetWithHeaderParamsServerRequest } from './openapi/requestServerTypes/GetWithHeaderParamsServerRequest'
import { GetWithPathParamsServerRequest } from './openapi/requestServerTypes/GetWithPathParamsServerRequest'
import { GetWithQueryParamsServerRequest } from './openapi/requestServerTypes/GetWithQueryParamsServerRequest'
import { PostSimpleNamedObjectServerRequest } from './openapi/requestServerTypes/PostSimpleNamedObjectServerRequest'
import { SampleOperationServerRequest } from './openapi/requestServerTypes/SampleOperationServerRequest'
import { GetSimpleNamedObjectResponse } from './openapi/responseTypes/GetSimpleNamedObjectResponse'
import { GetWithDefaultResponseResponse } from './openapi/responseTypes/GetWithDefaultResponseResponse'
import { GetWithHeaderParamsResponse } from './openapi/responseTypes/GetWithHeaderParamsResponse'
import { GetWithMultipleResponsesResponse } from './openapi/responseTypes/GetWithMultipleResponsesResponse'
import { GetWithPathParamsResponse } from './openapi/responseTypes/GetWithPathParamsResponse'
import { GetWithQueryParamsResponse } from './openapi/responseTypes/GetWithQueryParamsResponse'
import { PostSimpleNamedObjectResponse } from './openapi/responseTypes/PostSimpleNamedObjectResponse'
import { SampleOperationResponse } from './openapi/responseTypes/SampleOperationResponse'

const app = express()

class DummyApi implements Api<ExpressParameters> {
  async getSimpleNamedObject(): Promise<GetSimpleNamedObjectResponse> {
    return {
      headers: undefined,
      body: {
        booleanProperty: false,
        numberProperty: 12,
        stringProperty: 'fo',
      },
      mimeType: 'application/json',
      statusCode: 200,
    }
  }
  getWithDefaultResponse(_extra: ExpressParameters): Promise<GetWithDefaultResponseResponse> {
    throw new Error('Method not implemented.')
  }
  getWithHeaderParams(
    _input: GetWithHeaderParamsServerRequest,
    _extra: ExpressParameters,
  ): Promise<GetWithHeaderParamsResponse> {
    throw new Error('Method not implemented.')
  }
  getWithMultipleResponses(_extra: ExpressParameters): Promise<GetWithMultipleResponsesResponse> {
    throw new Error('Method not implemented.')
  }
  getWithPathParams(
    _input: GetWithPathParamsServerRequest,
    _extra: ExpressParameters,
  ): Promise<GetWithPathParamsResponse> {
    throw new Error('Method not implemented.')
  }
  getWithQueryParams(
    _input: GetWithQueryParamsServerRequest,
    _extra: ExpressParameters,
  ): Promise<GetWithQueryParamsResponse> {
    throw new Error('Method not implemented.')
  }
  postSimpleNamedObject(
    _input: PostSimpleNamedObjectServerRequest,
    _extra: ExpressParameters,
  ): Promise<PostSimpleNamedObjectResponse> {
    throw new Error('Method not implemented.')
  }
  sampleOperation(_input: SampleOperationServerRequest, _extra: ExpressParameters): Promise<SampleOperationResponse> {
    throw new Error('Method not implemented.')
  }
}

app.use(express.json())
app.use(createMainRoute(new DummyApi(), new ExpressServerConfiguration()))

app.listen(8000, () => {
  console.log('Listening on 8000')
})
