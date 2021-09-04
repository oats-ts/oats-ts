import { RequestConfig, execute } from '@oats-ts/http'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { getWithQueryParamsExpectations } from '../expectations/getWithQueryParamsExpectations'
import { GetWithQueryParamsInput } from '../inputTypes/GetWithQueryParamsInput'
import { getWithQueryParamsQuerySerializer } from '../querySerializers/getWithQueryParamsQuerySerializer'
import { GetWithQueryParamsResponse } from '../responseTypes/GetWithQueryParamsResponse'

export async function getWithQueryParams(
  input: GetWithQueryParamsInput,
  config: RequestConfig,
): Promise<GetWithQueryParamsResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, '/query-params', getWithQueryParamsQuerySerializer(input.query)), method: 'get' },
    config,
    getWithQueryParamsExpectations,
  )
}
