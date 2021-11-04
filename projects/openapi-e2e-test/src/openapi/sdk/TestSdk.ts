import { ClientConfiguration } from '@oats-ts/openapi-http'
import { LabelPathParametersRequest } from '../requestTypes/LabelPathParametersRequest'
import { MatrixPathParametersRequest } from '../requestTypes/MatrixPathParametersRequest'
import { SimplePathParametersRequest } from '../requestTypes/SimplePathParametersRequest'
import { LabelPathParametersResponse } from '../responseTypes/LabelPathParametersResponse'
import { MatrixPathParametersResponse } from '../responseTypes/MatrixPathParametersResponse'
import { SimplePathParametersResponse } from '../responseTypes/SimplePathParametersResponse'

export type TestSdk = {
  labelPathParameters(
    input: LabelPathParametersRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<LabelPathParametersResponse>
  matrixPathParameters(
    input: MatrixPathParametersRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<MatrixPathParametersResponse>
  simplePathParameters(
    input: SimplePathParametersRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<SimplePathParametersResponse>
}
