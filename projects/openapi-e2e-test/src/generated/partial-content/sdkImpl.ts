/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/partial-content.json (originating from oats-ts/oats-schemas)
 */

import { ClientAdapter, RunnableOperation } from '@oats-ts/openapi-runtime'
import { MissingBodyOperation, OptionalRequestBodyOperation } from './operations'
import { OptionalRequestBodyRequest } from './requestTypes'
import { MissingBodyResponse, OptionalRequestBodyResponse } from './responseTypes'
import { PartialContentSdk } from './sdkType'

export class PartialContentSdkImpl implements PartialContentSdk {
  protected readonly adapter: ClientAdapter
  public constructor(adapter: ClientAdapter) {
    this.adapter = adapter
  }
  public async missingBody(): Promise<MissingBodyResponse> {
    return this.createMissingBodyOperation().run()
  }
  public async optionalRequestBody(request: OptionalRequestBodyRequest): Promise<OptionalRequestBodyResponse> {
    return this.createOptionalRequestBodyOperation().run(request)
  }
  protected createMissingBodyOperation(): RunnableOperation<void, MissingBodyResponse> {
    return new MissingBodyOperation(this.adapter)
  }
  protected createOptionalRequestBodyOperation(): RunnableOperation<
    OptionalRequestBodyRequest,
    OptionalRequestBodyResponse
  > {
    return new OptionalRequestBodyOperation(this.adapter)
  }
}
