/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from edge-cases/status-code-ranges.json (originating from oats-ts/oats-schemas)
 */

import { ClientAdapter, RunnableOperation } from '@oats-ts/openapi-runtime'
import {
  Range1XxOperation,
  Range2XxOperation,
  Range3XxOperation,
  Range4XxOperation,
  Range5XxOperation,
  WithNormalStatusesOperation,
} from './operations'
import {
  Range1XxResponse,
  Range2XxResponse,
  Range3XxResponse,
  Range4XxResponse,
  Range5XxResponse,
  WithNormalStatusesResponse,
} from './responseTypes'
import { StatusCodeRangesSdk } from './sdkType'

export class StatusCodeRangesSdkImpl implements StatusCodeRangesSdk {
  protected readonly adapter: ClientAdapter
  public constructor(adapter: ClientAdapter) {
    this.adapter = adapter
  }
  public async range1Xx(): Promise<Range1XxResponse> {
    return this.createRange1XxOperation().run()
  }
  public async range2Xx(): Promise<Range2XxResponse> {
    return this.createRange2XxOperation().run()
  }
  public async range3Xx(): Promise<Range3XxResponse> {
    return this.createRange3XxOperation().run()
  }
  public async range4Xx(): Promise<Range4XxResponse> {
    return this.createRange4XxOperation().run()
  }
  public async range5Xx(): Promise<Range5XxResponse> {
    return this.createRange5XxOperation().run()
  }
  public async withNormalStatuses(): Promise<WithNormalStatusesResponse> {
    return this.createWithNormalStatusesOperation().run()
  }
  protected createRange1XxOperation(): RunnableOperation<void, Range1XxResponse> {
    return new Range1XxOperation(this.adapter)
  }
  protected createRange2XxOperation(): RunnableOperation<void, Range2XxResponse> {
    return new Range2XxOperation(this.adapter)
  }
  protected createRange3XxOperation(): RunnableOperation<void, Range3XxResponse> {
    return new Range3XxOperation(this.adapter)
  }
  protected createRange4XxOperation(): RunnableOperation<void, Range4XxResponse> {
    return new Range4XxOperation(this.adapter)
  }
  protected createRange5XxOperation(): RunnableOperation<void, Range5XxResponse> {
    return new Range5XxOperation(this.adapter)
  }
  protected createWithNormalStatusesOperation(): RunnableOperation<void, WithNormalStatusesResponse> {
    return new WithNormalStatusesOperation(this.adapter)
  }
}
