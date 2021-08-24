import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { RequestConfig, execute } from '@oats-ts/http'
import { GetWithDefaultResponseResponse } from '../responseTypes/GetWithDefaultResponseResponse'
import { getWithDefaultResponseExpectations } from '../expectations/getWithDefaultResponseExpectations'

export async function getWithDefaultResponse(config: RequestConfig): Promise<GetWithDefaultResponseResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, '/default-response-only'), method: 'get' },
    config,
    getWithDefaultResponseExpectations,
  )
}
