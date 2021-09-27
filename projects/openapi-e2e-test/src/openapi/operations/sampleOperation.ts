import { RequestConfig, execute } from '@oats-ts/http'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { sampleOperationExpectations } from '../expectations/sampleOperationExpectations'
import { sampleOperationHeadersSerializer } from '../headerSerializers/sampleOperationHeadersSerializer'
import { sampleOperationPathSerializer } from '../pathSerializers/sampleOperationPathSerializer'
import { sampleOperationQuerySerializer } from '../querySerializers/sampleOperationQuerySerializer'
import { SampleOperationRequest } from '../requestTypes/SampleOperationRequest'
import { SampleOperationResponse } from '../responseTypes/SampleOperationResponse'

export async function sampleOperation(
  input: SampleOperationRequest,
  config: RequestConfig,
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
      headers: { ...sampleOperationHeadersSerializer(input.headers), 'content-type': input.mimeType },
    },
    config,
    sampleOperationExpectations,
  )
}
