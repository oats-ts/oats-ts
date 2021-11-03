import { ClientConfiguration } from '@oats-ts/openapi-http'
import { SimplePathParametersRequest } from '../requestTypes/SimplePathParametersRequest'
import { SimplePathParametersResponse } from '../responseTypes/SimplePathParametersResponse'
import { TestSdk } from './TestSdk'

export class TestSdkStub implements TestSdk {
  public async simplePathParameters(
    _input: SimplePathParametersRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<SimplePathParametersResponse> {
    throw new Error(
      'Stub method "simplePathParameters" called. You should implement this method if you want to use it.',
    )
  }
}
