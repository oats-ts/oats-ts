import { fluent } from '@oats-ts/try'
import { stringify } from '@oats-ts/validators'
import { isNil } from 'lodash'
import {
  BodiesApi,
  OptionalRequestBodyResponse,
  OptionalRequestBodyServerRequest,
} from '../../generated/optional-request-body'

export class OptionalBodiesImpl implements BodiesApi {
  async optionalRequestBody(request: OptionalRequestBodyServerRequest): Promise<OptionalRequestBodyResponse> {
    return fluent(request.body).get(
      (body): OptionalRequestBodyResponse => ({
        statusCode: 200,
        mimeType: 'application/json',
        body: isNil(body) ? {} : { foo: body.foo },
      }),
      (issues): OptionalRequestBodyResponse => ({
        statusCode: 200,
        mimeType: 'application/json',
        body: { foo: issues.map(stringify).join('\n') },
      }),
    )
  }
}
