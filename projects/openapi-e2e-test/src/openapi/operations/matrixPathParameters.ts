import { ClientConfiguration } from '@oats-ts/openapi-http'
import { execute } from '@oats-ts/openapi-http-client'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { matrixPathParametersPathSerializer } from '../pathSerializers/matrixPathParametersPathSerializer'
import { MatrixPathParametersRequest } from '../requestTypes/MatrixPathParametersRequest'
import { matrixPathParametersResponseBodyValidator } from '../responseBodyValidators/matrixPathParametersResponseBodyValidator'
import { MatrixPathParametersResponse } from '../responseTypes/MatrixPathParametersResponse'

export async function matrixPathParameters(
  input: MatrixPathParametersRequest,
  config: ClientConfiguration,
): Promise<MatrixPathParametersResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, matrixPathParametersPathSerializer(input.path)), method: 'get' },
    config,
    matrixPathParametersResponseBodyValidator,
  )
}
