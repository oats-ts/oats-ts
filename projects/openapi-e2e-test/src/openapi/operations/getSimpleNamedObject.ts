import { RequestConfig, execute } from '@oats-ts/http'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { getSimpleNamedObjectExpectations } from '../expectations/getSimpleNamedObjectExpectations'
import { GetSimpleNamedObjectResponse } from '../responseTypes/GetSimpleNamedObjectResponse'

export async function getSimpleNamedObject(config: RequestConfig): Promise<GetSimpleNamedObjectResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, '/simple-named-object'), method: 'get' },
    config,
    getSimpleNamedObjectExpectations,
  )
}
