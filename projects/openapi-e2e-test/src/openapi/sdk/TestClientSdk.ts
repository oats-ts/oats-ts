import { ClientConfiguration } from '@oats-ts/openapi-http'
import { simplePathParameters } from '../operations/simplePathParameters'
import { SimplePathParametersRequest } from '../requestTypes/SimplePathParametersRequest'
import { SimplePathParametersResponse } from '../responseTypes/SimplePathParametersResponse'
import { TestSdk } from './TestSdk'

export class TestClientSdk implements TestSdk {
  protected readonly config: ClientConfiguration
  public constructor(config: ClientConfiguration) {
    this.config = config
  }
  public async simplePathParameters(
    input: SimplePathParametersRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<SimplePathParametersResponse> {
    return simplePathParameters(input, { ...this.config, ...config })
  }
}
