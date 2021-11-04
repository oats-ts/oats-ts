import { ClientConfiguration } from '@oats-ts/openapi-http'
import { labelPathParameters } from '../operations/labelPathParameters'
import { matrixPathParameters } from '../operations/matrixPathParameters'
import { simplePathParameters } from '../operations/simplePathParameters'
import { LabelPathParametersRequest } from '../requestTypes/LabelPathParametersRequest'
import { MatrixPathParametersRequest } from '../requestTypes/MatrixPathParametersRequest'
import { SimplePathParametersRequest } from '../requestTypes/SimplePathParametersRequest'
import { LabelPathParametersResponse } from '../responseTypes/LabelPathParametersResponse'
import { MatrixPathParametersResponse } from '../responseTypes/MatrixPathParametersResponse'
import { SimplePathParametersResponse } from '../responseTypes/SimplePathParametersResponse'
import { TestSdk } from './TestSdk'

export class TestClientSdk implements TestSdk {
  protected readonly config: ClientConfiguration
  public constructor(config: ClientConfiguration) {
    this.config = config
  }
  public async labelPathParameters(
    input: LabelPathParametersRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<LabelPathParametersResponse> {
    return labelPathParameters(input, { ...this.config, ...config })
  }
  public async matrixPathParameters(
    input: MatrixPathParametersRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<MatrixPathParametersResponse> {
    return matrixPathParameters(input, { ...this.config, ...config })
  }
  public async simplePathParameters(
    input: SimplePathParametersRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<SimplePathParametersResponse> {
    return simplePathParameters(input, { ...this.config, ...config })
  }
}
