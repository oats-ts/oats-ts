import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import http, { RequestOptions } from 'http'
import { URL } from 'url'

export async function httpRead(uri: string): Promise<Try<string>> {
  const { protocol, host, port = 80, pathname: path = '/' } = new URL(uri)

  if (protocol !== 'http:') {
    return failure([
      {
        message: `expected "http" protocol`,
        path: uri,
        severity: 'error',
        type: IssueTypes.other,
      },
    ])
  }

  const options: RequestOptions = {
    method: 'GET',
    host,
    port,
    path,
  }

  return new Promise((resolve) => {
    const request = http.request(options, (response) => {
      const data: any[] = []
      response.headers
      response.on('data', (chunk: any) => data.push(chunk))
      response.on('end', () => resolve(success(Buffer.concat(data).toString())))
    })
    request.on('error', (error) => resolve(failure([])))
    request.end()
  })
}
