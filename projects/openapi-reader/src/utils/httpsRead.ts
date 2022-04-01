import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import https, { RequestOptions } from 'https'
import { URL } from 'url'

export async function httpsRead(uri: string): Promise<Try<string>> {
  const { protocol, host, port = 443, pathname: path = '/' } = new URL(uri)

  if (protocol !== 'https:') {
    return failure([
      {
        message: `expected "https" protocol`,
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
    const request = https.request(options, (response) => {
      const data: any[] = []
      response.headers
      response.on('data', (chunk: any) => data.push(chunk))
      response.on('end', () => resolve(success(Buffer.concat(data).toString())))
    })
    request.on('error', (error) => resolve(failure([])))
    request.end()
  })
}
