import { ClientConfiguration } from '@oats-ts/openapi-http'
import { execute } from '@oats-ts/openapi-http-client'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { getWithPathParamsExpectations } from '../expectations/getWithPathParamsExpectations'
import { getWithPathParamsPathSerializer } from '../pathSerializers/getWithPathParamsPathSerializer'
import { GetWithPathParamsRequest } from '../requestTypes/GetWithPathParamsRequest'
import { GetWithPathParamsResponse } from '../responseTypes/GetWithPathParamsResponse'

export async function getWithPathParams(
  input: GetWithPathParamsRequest,
  config: ClientConfiguration,
): Promise<GetWithPathParamsResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, getWithPathParamsPathSerializer(input.path)), method: 'get' },
    config,
    getWithPathParamsExpectations,
  )
}
