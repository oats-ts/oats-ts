import { FetchClientAdapter } from '@oats-ts/openapi-fetch-client-adapter'
import YAML from 'yamljs'
import { BodiesSdkImpl } from '../generated/bodies'
import { BodiesSdkImpl as OptionalReqBodySdkImpl } from '../generated/optional-request-body'
import { BookStoreSdkImpl } from '../generated/book-store'
import { HttpMethodsSdkImpl } from '../generated/methods'
import { ParametersSdkImpl } from '../generated/Parameters'
import { PATH } from './constants'

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

export const optionalRequestBodySdk = new OptionalReqBodySdkImpl(defaultAdapter)
