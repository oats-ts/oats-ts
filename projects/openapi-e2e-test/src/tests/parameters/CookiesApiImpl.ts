import { isSuccess } from '@oats-ts/try'
import { CookiesApi } from '../../generated/cookies/apiType'
import { LoginServerRequest, ProtectedPathServerRequest } from '../../generated/cookies/requestServerTypes'
import { LoginServerResponse, ProtectedPathServerResponse } from '../../generated/cookies/responseServerTypes'
import { USER_NAME } from './userName'

export class CookiesApiImpl implements CookiesApi {
  async login(request: LoginServerRequest): Promise<LoginServerResponse> {
    if (!isSuccess(request.body) || request.body.data.name !== USER_NAME) {
      return {
        statusCode: 401,
      }
    }
    return { statusCode: 200, cookies: [{ name: 'token', value: request.body.data.name }] }
  }
  async protectedPath(request: ProtectedPathServerRequest): Promise<ProtectedPathServerResponse> {
    if (!isSuccess(request.cookies) || request.cookies.data.token !== USER_NAME) {
      return { statusCode: 401 }
    }
    return {
      statusCode: 200,
      mimeType: 'application/json',
      body: {
        name: request.cookies.data.token,
      },
    }
  }
}
