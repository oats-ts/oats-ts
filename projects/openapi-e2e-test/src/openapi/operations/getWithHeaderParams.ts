import { ClientConfiguration } from '@oats-ts/openapi-http'
import { execute } from '@oats-ts/openapi-http-client'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { getWithHeaderParamsRequestHeadersSerializer } from '../requestHeaderSerializers/getWithHeaderParamsRequestHeadersSerializer'
import { GetWithHeaderParamsRequest } from '../requestTypes/GetWithHeaderParamsRequest'
import { getWithHeaderParamsResponseBodyValidator } from '../responseBodyValidators/getWithHeaderParamsResponseBodyValidator'
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
    getWithHeaderParamsResponseBodyValidator,
  )
}
