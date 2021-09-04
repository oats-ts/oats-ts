import { RequestConfig, execute } from '@oats-ts/http'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { getWithDefaultResponseExpectations } from '../expectations/getWithDefaultResponseExpectations'
import { GetWithDefaultResponseResponse } from '../responseTypes/GetWithDefaultResponseResponse'

export async function getWithDefaultResponse(config: RequestConfig): Promise<GetWithDefaultResponseResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, '/default-response-only'), method: 'get' },
    config,
    getWithDefaultResponseExpectations,
  )
}
