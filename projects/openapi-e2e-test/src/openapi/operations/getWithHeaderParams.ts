import { RequestConfig, execute } from '@oats-ts/http'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { getWithHeaderParamsExpectations } from '../expectations/getWithHeaderParamsExpectations'
import { getWithHeaderParamsHeadersSerializer } from '../headerSerializers/getWithHeaderParamsHeadersSerializer'
import { GetWithHeaderParamsRequest } from '../requestTypes/GetWithHeaderParamsRequest'
import { GetWithHeaderParamsResponse } from '../responseTypes/GetWithHeaderParamsResponse'

export async function getWithHeaderParams(
  input: GetWithHeaderParamsRequest,
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
