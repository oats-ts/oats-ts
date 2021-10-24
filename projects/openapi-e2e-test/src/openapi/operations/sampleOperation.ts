import { ClientConfiguration } from '@oats-ts/openapi-http'
import { execute } from '@oats-ts/openapi-http-client'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { sampleOperationPathSerializer } from '../pathSerializers/sampleOperationPathSerializer'
import { sampleOperationQuerySerializer } from '../querySerializers/sampleOperationQuerySerializer'
import { sampleOperationRequestHeadersSerializer } from '../requestHeaderSerializers/sampleOperationRequestHeadersSerializer'
import { SampleOperationRequest } from '../requestTypes/SampleOperationRequest'
import { sampleOperationResponseBodyValidator } from '../responseBodyValidators/sampleOperationResponseBodyValidator'
import { SampleOperationResponse } from '../responseTypes/SampleOperationResponse'

export async function sampleOperation(
  input: SampleOperationRequest,
  config: ClientConfiguration,
): Promise<SampleOperationResponse> {
  return execute(
    {
      url: joinUrl(
        config.baseUrl,
        sampleOperationPathSerializer(input.path),
        sampleOperationQuerySerializer(input.query),
      ),
      method: 'post',
      body: await config.serialize(input.mimeType, input.body),
      headers: { ...sampleOperationRequestHeadersSerializer(input.headers), 'content-type': input.mimeType },
    },
    config,
    sampleOperationResponseBodyValidator,
  )
}
