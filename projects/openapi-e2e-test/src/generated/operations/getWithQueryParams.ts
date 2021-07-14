import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { RequestConfig, execute } from '@oats-ts/http'
import { GetWithQueryParamsInput } from '../inputTypes/GetWithQueryParamsInput'
import { GetWithQueryParamsResponse } from '../responseTypes/GetWithQueryParamsResponse'
import { getWithQueryParamsQuerySerializer } from '../querySerializers/getWithQueryParamsQuerySerializer'
import { getWithQueryParamsExpectations } from '../expectations/getWithQueryParamsExpectations'

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
