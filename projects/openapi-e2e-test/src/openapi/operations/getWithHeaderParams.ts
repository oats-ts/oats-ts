import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { RequestConfig, execute } from '@oats-ts/http'
import { GetWithHeaderParamsInput } from '../inputTypes/GetWithHeaderParamsInput'
import { GetWithHeaderParamsResponse } from '../responseTypes/GetWithHeaderParamsResponse'
import { getWithHeaderParamsHeadersSerializer } from '../headerSerializers/getWithHeaderParamsHeadersSerializer'
import { getWithHeaderParamsExpectations } from '../expectations/getWithHeaderParamsExpectations'

export async function getWithHeaderParams(
  input: GetWithHeaderParamsInput,
  config: RequestConfig,
): Promise<GetWithHeaderParamsResponse> {
  return execute(
    {
      url: joinUrl(config.baseUrl, '/header-params'),
      method: 'get',
      headers: getWithHeaderParamsHeadersSerializer(input.headers),
    },
    config,
    getWithHeaderParamsExpectations,
  )
}
