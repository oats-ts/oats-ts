import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { RequestConfig, execute } from '@oats-ts/http'
import { GetWithPathParamsInput } from '../inputTypes/GetWithPathParamsInput'
import { GetWithPathParamsResponse } from '../responseTypes/GetWithPathParamsResponse'
import { getWithPathParamsPathSerializer } from '../pathSerializers/getWithPathParamsPathSerializer'
import { getWithPathParamsExpectations } from '../expectations/getWithPathParamsExpectations'

export async function getWithPathParams(
  input: GetWithPathParamsInput,
  config: RequestConfig,
): Promise<GetWithPathParamsResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, getWithPathParamsPathSerializer(input.path)), method: 'get' },
    config,
    getWithPathParamsExpectations,
  )
}
