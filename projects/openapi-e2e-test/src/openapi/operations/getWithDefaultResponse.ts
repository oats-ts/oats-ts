import { ClientConfiguration } from '@oats-ts/openapi-http'
import { execute } from '@oats-ts/openapi-http-client'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { getWithDefaultResponseExpectations } from '../expectations/getWithDefaultResponseExpectations'
import { GetWithDefaultResponseResponse } from '../responseTypes/GetWithDefaultResponseResponse'

export async function getWithDefaultResponse(config: ClientConfiguration): Promise<GetWithDefaultResponseResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, '/default-response-only'), method: 'get' },
    config,
    getWithDefaultResponseExpectations,
  )
}
