import { FetchClientAdapter } from '@oats-ts/openapi-fetch-client-adapter'
import YAML from 'yamljs'
import { PartialContentSdkImpl } from '../generated/partial-content/sdkImpl'
import { BodiesSdkImpl } from '../generated/bodies/sdkImpl'
import { PATH } from './constants'
import { BookStoreSdkImpl } from '../generated/book-store/sdkImpl'
import { HttpMethodsSdkImpl } from '../generated/methods/sdkImpl'
import { ParametersSdkImpl } from '../generated/parameters/sdkImpl'
import { CookiesSdkImpl } from '../generated/cookies/sdkImpl'

class YamlFetchClientAdapter extends FetchClientAdapter {
  override async getParsedResponseBody(response: any): Promise<any> {
    return YAML.parse(await response.text())
  }
  override async getRequestBody(_mimeType: string, body: any): Promise<any> {
    return YAML.stringify(body)
  }
}

const defaultAdapter = new FetchClientAdapter({ url: PATH })
const yamlAdapter = new YamlFetchClientAdapter({ url: PATH })

export const bodiesSdk = (mimeType: 'application/json' | 'application/yaml') =>
  new BodiesSdkImpl(mimeType === 'application/json' ? defaultAdapter : yamlAdapter)

export const bookstoreSdk = new BookStoreSdkImpl(defaultAdapter)

export const httpMethodsSdk = new HttpMethodsSdkImpl(defaultAdapter)

export const parametersSdk = new ParametersSdkImpl(defaultAdapter)

export const partialContentSdk = new PartialContentSdkImpl(defaultAdapter)

export const cookiesSdk = new CookiesSdkImpl(defaultAdapter)
