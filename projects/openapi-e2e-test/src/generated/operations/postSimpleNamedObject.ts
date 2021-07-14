import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { RequestConfig, execute } from '@oats-ts/http'
import { PostSimpleNamedObjectInput } from '../inputTypes/PostSimpleNamedObjectInput'
import { PostSimpleNamedObjectResponse } from '../responseTypes/PostSimpleNamedObjectResponse'
import { postSimpleNamedObjectExpectations } from '../expectations/postSimpleNamedObjectExpectations'

export async function postSimpleNamedObject(
  input: PostSimpleNamedObjectInput,
  config: RequestConfig,
): Promise<PostSimpleNamedObjectResponse> {
  return execute(
    {
      url: joinUrl(config.baseUrl, '/simple-named-object'),
      method: 'post',
      body: await config.serialize(input.contentType, input.body),
      headers: { 'content-type': input.contentType },
    },
    config,
    postSimpleNamedObjectExpectations,
  )
}
