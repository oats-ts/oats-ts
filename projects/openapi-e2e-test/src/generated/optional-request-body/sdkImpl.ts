/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/optional-request-body.json (originating from oats-ts/oats-schemas)
 */

import { ClientAdapter, RunnableOperation } from '@oats-ts/openapi-runtime'
import { OptionalRequestBodyOperation } from './operations'
import { OptionalRequestBodyRequest } from './requestTypes'
import { OptionalRequestBodyResponse } from './responseTypes'
import { OptionalBodiesSdk } from './sdkType'

export class OptionalBodiesSdkImpl implements OptionalBodiesSdk {
  protected readonly adapter: ClientAdapter
  public constructor(adapter: ClientAdapter) {
    this.adapter = adapter
  }
  public async optionalRequestBody(request: OptionalRequestBodyRequest): Promise<OptionalRequestBodyResponse> {
    return this.createOptionalRequestBodyOperation().run(request)
  }
  protected createOptionalRequestBodyOperation(): RunnableOperation<
    OptionalRequestBodyRequest,
    OptionalRequestBodyResponse
  > {
    return new OptionalRequestBodyOperation(this.adapter)
  }
}
