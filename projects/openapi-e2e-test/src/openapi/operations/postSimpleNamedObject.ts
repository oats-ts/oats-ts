import { RequestConfig, execute } from '@oats-ts/http'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { postSimpleNamedObjectExpectations } from '../expectations/postSimpleNamedObjectExpectations'
import { PostSimpleNamedObjectRequest } from '../requestTypes/PostSimpleNamedObjectRequest'
import { PostSimpleNamedObjectResponse } from '../responseTypes/PostSimpleNamedObjectResponse'

export async function postSimpleNamedObject(
  input: PostSimpleNamedObjectRequest,
  config: RequestConfig,
): Promise<PostSimpleNamedObjectResponse> {
  return execute(
    {
      url: joinUrl(config.baseUrl, '/simple-named-object'),
      method: 'post',
      body: await config.serialize(input.mimeType, input.body),
      headers: { 'content-type': input.mimeType },
    },
    config,
    postSimpleNamedObjectExpectations,
  )
}
