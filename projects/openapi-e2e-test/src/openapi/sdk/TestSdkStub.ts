import { ClientConfiguration } from '@oats-ts/openapi-http'
import { LabelPathParametersRequest } from '../requestTypes/LabelPathParametersRequest'
import { MatrixPathParametersRequest } from '../requestTypes/MatrixPathParametersRequest'
import { SimplePathParametersRequest } from '../requestTypes/SimplePathParametersRequest'
import { LabelPathParametersResponse } from '../responseTypes/LabelPathParametersResponse'
import { MatrixPathParametersResponse } from '../responseTypes/MatrixPathParametersResponse'
import { SimplePathParametersResponse } from '../responseTypes/SimplePathParametersResponse'
import { TestSdk } from './TestSdk'

export class TestSdkStub implements TestSdk {
  public async labelPathParameters(
    _input: LabelPathParametersRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<LabelPathParametersResponse> {
    throw new Error('Stub method "labelPathParameters" called. You should implement this method if you want to use it.')
  }
  public async matrixPathParameters(
    _input: MatrixPathParametersRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<MatrixPathParametersResponse> {
    throw new Error(
      'Stub method "matrixPathParameters" called. You should implement this method if you want to use it.',
    )
  }
  public async simplePathParameters(
    _input: SimplePathParametersRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<SimplePathParametersResponse> {
    throw new Error(
      'Stub method "simplePathParameters" called. You should implement this method if you want to use it.',
    )
  }
}
