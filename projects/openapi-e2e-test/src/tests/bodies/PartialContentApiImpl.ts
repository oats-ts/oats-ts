import { isSuccess } from '@oats-ts/try'
import { stringify } from '@oats-ts/validators'
import { isNil } from 'lodash'
import { PartialContentApi } from '../../generated/partial-content/apiType'
import { OptionalRequestBodyServerRequest } from '../../generated/partial-content/requestServerTypes'
import {
  MissingBodyServerResponse,
  OptionalRequestBodyServerResponse,
} from '../../generated/partial-content/responseServerTypes'

export class PartialContentApiImpl implements PartialContentApi {
  async missingBody(): Promise<MissingBodyServerResponse> {
    return {
      statusCode: 200,
    }
  }
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
