import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { RequestConfig, execute } from '@oats-ts/http'
import { GetWithMultipleResponsesResponse } from '../responseTypes/GetWithMultipleResponsesResponse'
import { getWithMultipleResponsesExpectations } from '../expectations/getWithMultipleResponsesExpectations'

export async function getWithMultipleResponses(config: RequestConfig): Promise<GetWithMultipleResponsesResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, '/multiple-responses'), method: 'get' },
    config,
    getWithMultipleResponsesExpectations,
  )
}
