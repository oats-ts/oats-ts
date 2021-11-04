import { ClientConfiguration } from '@oats-ts/openapi-http'
import { execute } from '@oats-ts/openapi-http-client'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { labelPathParametersPathSerializer } from '../pathSerializers/labelPathParametersPathSerializer'
import { LabelPathParametersRequest } from '../requestTypes/LabelPathParametersRequest'
import { labelPathParametersResponseBodyValidator } from '../responseBodyValidators/labelPathParametersResponseBodyValidator'
import { LabelPathParametersResponse } from '../responseTypes/LabelPathParametersResponse'

export async function labelPathParameters(
  input: LabelPathParametersRequest,
  config: ClientConfiguration,
): Promise<LabelPathParametersResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, labelPathParametersPathSerializer(input.path)), method: 'get' },
    config,
    labelPathParametersResponseBodyValidator,
  )
}
