import { ClientConfiguration } from '@oats-ts/openapi-http'
import { execute } from '@oats-ts/openapi-http-client'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { getSimpleNamedObjectExpectations } from '../expectations/getSimpleNamedObjectExpectations'
import { GetSimpleNamedObjectResponse } from '../responseTypes/GetSimpleNamedObjectResponse'

export async function getSimpleNamedObject(config: ClientConfiguration): Promise<GetSimpleNamedObjectResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, '/simple-named-object'), method: 'get' },
    config,
    getSimpleNamedObjectExpectations,
  )
}
