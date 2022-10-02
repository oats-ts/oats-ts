import { isSuccess } from '@oats-ts/try'
import { stringify } from '@oats-ts/validators'
import { isNil } from 'lodash'
import { OptionalBodiesApi } from '../../generated/optional-request-body/apiType'
import { OptionalRequestBodyServerRequest } from '../../generated/optional-request-body/requestServerTypes'
import { OptionalRequestBodyServerResponse } from '../../generated/optional-request-body/responseServerTypes'

export class OptionalBodiesImpl implements OptionalBodiesApi {
  async optionalRequestBody(request: OptionalRequestBodyServerRequest): Promise<OptionalRequestBodyServerResponse> {
    if (isSuccess(request.body)) {
      return {
        statusCode: 200,
        mimeType: 'application/json',
        body: isNil(request.body.data) ? {} : { foo: request.body.data.foo },
      }
    }
    return {
      statusCode: 200,
      mimeType: 'application/json',
      body: { foo: request.body.issues.map(stringify).join('\n') },
    }
  }
}
