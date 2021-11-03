import { SimplePathParametersServerRequest } from '../requestServerTypes/SimplePathParametersServerRequest'
import { SimplePathParametersResponse } from '../responseTypes/SimplePathParametersResponse'

export type TestApi<T> = {
  simplePathParameters(input: SimplePathParametersServerRequest, extra: T): Promise<SimplePathParametersResponse>
}
