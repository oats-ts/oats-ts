/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/cookies.json (originating from oats-ts/oats-schemas)
 */

import { ClientAdapter, RunnableOperation } from '@oats-ts/openapi-runtime'
import { LoginOperation, ProtectedPathOperation } from './operations'
import { LoginRequest, ProtectedPathRequest } from './requestTypes'
import { LoginResponse, ProtectedPathResponse } from './responseTypes'
import { CookiesSdk } from './sdkType'

export class CookiesSdkImpl implements CookiesSdk {
  protected readonly adapter: ClientAdapter
  public constructor(adapter: ClientAdapter) {
    this.adapter = adapter
  }
  public async login(request: LoginRequest): Promise<LoginResponse> {
    return this.createLoginOperation().run(request)
  }
  public async protectedPath(request: ProtectedPathRequest): Promise<ProtectedPathResponse> {
    return this.createProtectedPathOperation().run(request)
  }
  protected createLoginOperation(): RunnableOperation<LoginRequest, LoginResponse> {
    return new LoginOperation(this.adapter)
  }
  protected createProtectedPathOperation(): RunnableOperation<ProtectedPathRequest, ProtectedPathResponse> {
    return new ProtectedPathOperation(this.adapter)
  }
}