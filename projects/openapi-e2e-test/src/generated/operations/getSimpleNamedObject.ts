import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { RequestConfig, execute } from '@oats-ts/http'
import { GetSimpleNamedObjectResponse } from '../responseTypes/GetSimpleNamedObjectResponse'
import { getSimpleNamedObjectExpectations } from '../expectations/getSimpleNamedObjectExpectations'

export async function getSimpleNamedObject(config: RequestConfig): Promise<GetSimpleNamedObjectResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, '/simple-named-object'), method: 'get' },
    config,
    getSimpleNamedObjectExpectations,
  )
}
