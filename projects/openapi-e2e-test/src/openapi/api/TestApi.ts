import { LabelPathParametersServerRequest } from '../requestServerTypes/LabelPathParametersServerRequest'
import { MatrixPathParametersServerRequest } from '../requestServerTypes/MatrixPathParametersServerRequest'
import { SimplePathParametersServerRequest } from '../requestServerTypes/SimplePathParametersServerRequest'
import { LabelPathParametersResponse } from '../responseTypes/LabelPathParametersResponse'
import { MatrixPathParametersResponse } from '../responseTypes/MatrixPathParametersResponse'
import { SimplePathParametersResponse } from '../responseTypes/SimplePathParametersResponse'

export type TestApi<T> = {
  labelPathParameters(input: LabelPathParametersServerRequest, extra: T): Promise<LabelPathParametersResponse>
  matrixPathParameters(input: MatrixPathParametersServerRequest, extra: T): Promise<MatrixPathParametersResponse>
  simplePathParameters(input: SimplePathParametersServerRequest, extra: T): Promise<SimplePathParametersResponse>
}
