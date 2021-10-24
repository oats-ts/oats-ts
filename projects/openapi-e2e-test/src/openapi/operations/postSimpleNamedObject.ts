import { ClientConfiguration } from '@oats-ts/openapi-http'
import { execute } from '@oats-ts/openapi-http-client'
import { joinUrl } from '@oats-ts/openapi-parameter-serialization'
import { PostSimpleNamedObjectRequest } from '../requestTypes/PostSimpleNamedObjectRequest'
import { postSimpleNamedObjectResponseBodyValidator } from '../responseBodyValidators/postSimpleNamedObjectResponseBodyValidator'
import { PostSimpleNamedObjectResponse } from '../responseTypes/PostSimpleNamedObjectResponse'

export async function postSimpleNamedObject(
  input: PostSimpleNamedObjectRequest,
  config: ClientConfiguration,
): Promise<PostSimpleNamedObjectResponse> {
  return execute(
    {
      url: joinUrl(config.baseUrl, '/simple-named-object'),
      method: 'post',
      body: await config.serialize(input.mimeType, input.body),
      headers: { 'content-type': input.mimeType },
    },
    config,
    postSimpleNamedObjectResponseBodyValidator,
  )
}
