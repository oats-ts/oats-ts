import { ClientConfiguration } from '@oats-ts/openapi-http'
import { execute } from '@oats-ts/openapi-http-client'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { getWithQueryParamsQuerySerializer } from '../querySerializers/getWithQueryParamsQuerySerializer'
import { GetWithQueryParamsRequest } from '../requestTypes/GetWithQueryParamsRequest'
import { getWithQueryParamsResponseBodyValidator } from '../responseBodyValidators/getWithQueryParamsResponseBodyValidator'
import { GetWithQueryParamsResponse } from '../responseTypes/GetWithQueryParamsResponse'

export async function getWithQueryParams(
  input: GetWithQueryParamsRequest,
  config: ClientConfiguration,
): Promise<GetWithQueryParamsResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, '/query-params', getWithQueryParamsQuerySerializer(input.query)), method: 'get' },
    config,
    getWithQueryParamsResponseBodyValidator,
  )
}
