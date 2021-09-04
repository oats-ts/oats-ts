import { RequestConfig, execute } from '@oats-ts/http'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { getWithPathParamsExpectations } from '../expectations/getWithPathParamsExpectations'
import { GetWithPathParamsInput } from '../inputTypes/GetWithPathParamsInput'
import { getWithPathParamsPathSerializer } from '../pathSerializers/getWithPathParamsPathSerializer'
import { GetWithPathParamsResponse } from '../responseTypes/GetWithPathParamsResponse'

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
