import { ClientConfiguration } from '@oats-ts/openapi-http'
import { SimplePathParametersRequest } from '../requestTypes/SimplePathParametersRequest'
import { SimplePathParametersResponse } from '../responseTypes/SimplePathParametersResponse'

export type TestSdk = {
  simplePathParameters(
    input: SimplePathParametersRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<SimplePathParametersResponse>
}
