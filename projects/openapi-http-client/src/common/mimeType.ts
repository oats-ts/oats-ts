import MIMEType from 'whatwg-mimetype'
import { ResponseLike } from './typings'

export async function mimeType(response: ResponseLike): Promise<string> {
  if (!response.headers.has('content-type')) {
    throw new Error('Expected "content-type" header to be present.')
  }
  const contentType = response.headers.get('content-type')
  return new MIMEType(contentType).essence
}
