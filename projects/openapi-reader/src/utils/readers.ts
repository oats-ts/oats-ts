import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import { URL } from 'url'
import URI from 'urijs'
import http, { RequestOptions as HttpRequestOptions } from 'http'
import https, { RequestOptions as HttpsRequestOptions } from 'https'
import { fileURLToPath } from 'url'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

export async function fileRead(uri: string): Promise<Try<string>> {
  try {
    const path = resolve(fileURLToPath(uri))
    const content = await readFile(path, { encoding: 'utf-8' })
    return success(content)
  } catch (error) {
    return failure([
      {
        message: `${error}`,
        path: uri,
        severity: 'error',
        type: IssueTypes.other,
      },
    ])
  }
}

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

  const options: HttpRequestOptions = {
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
    request.on('error', (error) =>
      resolve(
        failure([
          {
            message: `${error}`,
            path: uri,
            severity: 'error',
            type: IssueTypes.other,
          },
        ]),
      ),
    )
    request.end()
  })
}

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

  const options: HttpsRequestOptions = {
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
    request.on('error', (error) =>
      resolve(
        failure([
          {
            message: `${error}`,
            path: uri,
            severity: 'error',
            type: IssueTypes.other,
          },
        ]),
      ),
    )
    request.end()
  })
}

export async function mixedRead(uri: string): Promise<Try<string>> {
  try {
    const scheme = new URI(uri).scheme()
    switch (scheme) {
      case 'http':
        return httpRead(uri)
      case 'https':
        return httpsRead(uri)
      case 'file':
        return fileRead(uri)
      default:
        return failure([
          {
            message: `unexpected URI scheme: "${scheme}" (expected "http", "https" or "file")`,
            path: uri,
            severity: 'error',
            type: IssueTypes.other,
          },
        ])
    }
  } catch (error) {
    return failure([
      {
        message: `${error}`,
        path: uri,
        severity: 'error',
        type: IssueTypes.other,
      },
    ])
  }
}
