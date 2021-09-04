import { RequestConfig, execute } from '@oats-ts/http'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { getWithMultipleResponsesExpectations } from '../expectations/getWithMultipleResponsesExpectations'
import { GetWithMultipleResponsesResponse } from '../responseTypes/GetWithMultipleResponsesResponse'

export async function getWithMultipleResponses(config: RequestConfig): Promise<GetWithMultipleResponsesResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, '/multiple-responses'), method: 'get' },
    config,
    getWithMultipleResponsesExpectations,
  )
}
