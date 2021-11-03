import { ClientConfiguration } from '@oats-ts/openapi-http'
import { execute } from '@oats-ts/openapi-http-client'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { simplePathParametersPathSerializer } from '../pathSerializers/simplePathParametersPathSerializer'
import { SimplePathParametersRequest } from '../requestTypes/SimplePathParametersRequest'
import { simplePathParametersResponseBodyValidator } from '../responseBodyValidators/simplePathParametersResponseBodyValidator'
import { SimplePathParametersResponse } from '../responseTypes/SimplePathParametersResponse'

export async function simplePathParameters(
  input: SimplePathParametersRequest,
  config: ClientConfiguration,
): Promise<SimplePathParametersResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, simplePathParametersPathSerializer(input.path)), method: 'get' },
    config,
    simplePathParametersResponseBodyValidator,
  )
}
