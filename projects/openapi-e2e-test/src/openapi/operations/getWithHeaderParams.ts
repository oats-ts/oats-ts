import { ClientConfiguration } from '@oats-ts/openapi-http'
import { execute } from '@oats-ts/openapi-http-client'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { getWithHeaderParamsExpectations } from '../expectations/getWithHeaderParamsExpectations'
import { getWithHeaderParamsRequestHeadersSerializer } from '../requestHeaderSerializers/getWithHeaderParamsRequestHeadersSerializer'
import { GetWithHeaderParamsRequest } from '../requestTypes/GetWithHeaderParamsRequest'
import { GetWithHeaderParamsResponse } from '../responseTypes/GetWithHeaderParamsResponse'

export async function getWithHeaderParams(
  input: GetWithHeaderParamsRequest,
  config: ClientConfiguration,
): Promise<GetWithHeaderParamsResponse> {
  return execute(
    {
      url: joinUrl(config.baseUrl, '/header-params'),
      method: 'get',
      headers: getWithHeaderParamsRequestHeadersSerializer(input.headers),
    },
    config,
    getWithHeaderParamsExpectations,
  )
}
