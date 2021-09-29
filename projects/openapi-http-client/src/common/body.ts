import { ResponseLike } from './typings'

export async function body(response: ResponseLike, contentType: string): Promise<any> {
  switch (contentType) {
    case 'application/json':
      return response.json()
    case 'text/plain':
      return response.text()
    default:
      return response.blob()
  }
}
