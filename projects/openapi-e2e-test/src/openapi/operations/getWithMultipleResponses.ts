import { ClientConfiguration } from '@oats-ts/openapi-http'
import { execute } from '@oats-ts/openapi-http-client'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { getWithMultipleResponsesExpectations } from '../expectations/getWithMultipleResponsesExpectations'
import { GetWithMultipleResponsesResponse } from '../responseTypes/GetWithMultipleResponsesResponse'

export async function getWithMultipleResponses(config: ClientConfiguration): Promise<GetWithMultipleResponsesResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, '/multiple-responses'), method: 'get' },
    config,
    getWithMultipleResponsesExpectations,
  )
}
