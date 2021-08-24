import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { RequestConfig, execute } from '@oats-ts/http'
import { SampleOperationInput } from '../inputTypes/SampleOperationInput'
import { SampleOperationResponse } from '../responseTypes/SampleOperationResponse'
import { sampleOperationPathSerializer } from '../pathSerializers/sampleOperationPathSerializer'
import { sampleOperationQuerySerializer } from '../querySerializers/sampleOperationQuerySerializer'
import { sampleOperationHeadersSerializer } from '../headerSerializers/sampleOperationHeadersSerializer'
import { sampleOperationExpectations } from '../expectations/sampleOperationExpectations'

export async function sampleOperation(
  input: SampleOperationInput,
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
