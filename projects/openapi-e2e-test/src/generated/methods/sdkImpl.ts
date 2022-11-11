/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/methods.json (originating from oats-ts/oats-schemas)
 */

import { ClientAdapter, RunnableOperation } from '@oats-ts/openapi-runtime'
import {
  DeleteMethodOperation,
  GetMethodOperation,
  PatchMethodOperation,
  PostMethodOperation,
  PutMethodOperation,
} from './operations'
import {
  DeleteMethodResponse,
  GetMethodResponse,
  PatchMethodResponse,
  PostMethodResponse,
  PutMethodResponse,
} from './responseTypes'
import { HttpMethodsSdk } from './sdkType'

export class HttpMethodsSdkImpl implements HttpMethodsSdk {
  protected readonly adapter: ClientAdapter
  public constructor(adapter: ClientAdapter) {
    this.adapter = adapter
  }
  public async getMethod(): Promise<GetMethodResponse> {
    return this.createGetMethodOperation().run()
  }
  public async postMethod(): Promise<PostMethodResponse> {
    return this.createPostMethodOperation().run()
  }
  public async putMethod(): Promise<PutMethodResponse> {
    return this.createPutMethodOperation().run()
  }
  public async patchMethod(): Promise<PatchMethodResponse> {
    return this.createPatchMethodOperation().run()
  }
  public async deleteMethod(): Promise<DeleteMethodResponse> {
    return this.createDeleteMethodOperation().run()
  }
  protected createGetMethodOperation(): RunnableOperation<void, GetMethodResponse> {
    return new GetMethodOperation(this.adapter)
  }
  protected createPostMethodOperation(): RunnableOperation<void, PostMethodResponse> {
    return new PostMethodOperation(this.adapter)
  }
  protected createPutMethodOperation(): RunnableOperation<void, PutMethodResponse> {
    return new PutMethodOperation(this.adapter)
  }
  protected createPatchMethodOperation(): RunnableOperation<void, PatchMethodResponse> {
    return new PatchMethodOperation(this.adapter)
  }
  protected createDeleteMethodOperation(): RunnableOperation<void, DeleteMethodResponse> {
    return new DeleteMethodOperation(this.adapter)
  }
}
