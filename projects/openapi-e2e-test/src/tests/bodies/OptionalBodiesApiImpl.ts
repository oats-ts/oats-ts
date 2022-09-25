import { fluent } from '@oats-ts/try'
import { stringify } from '@oats-ts/validators'
import { isNil } from 'lodash'
import { BodiesApi } from '../../generated/optional-request-body/apiType'
import { OptionalRequestBodyServerRequest } from '../../generated/optional-request-body/requestServerTypes'
import { OptionalRequestBodyServerResponse } from '../../generated/optional-request-body/responseServerTypes'

export class OptionalBodiesImpl implements BodiesApi {
  async optionalRequestBody(request: OptionalRequestBodyServerRequest): Promise<OptionalRequestBodyServerResponse> {
    return fluent(request.body).get(
      (body): OptionalRequestBodyServerResponse => ({
        statusCode: 200,
        mimeType: 'application/json',
        body: isNil(body) ? {} : { foo: body.foo },
      }),
      (issues): OptionalRequestBodyServerResponse => ({
        statusCode: 200,
        mimeType: 'application/json',
        body: { foo: issues.map(stringify).join('\n') },
      }),
    )
  }
}
