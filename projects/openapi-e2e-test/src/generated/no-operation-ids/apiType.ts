/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from edge-cases/no-operation-ids.json (originating from oats-ts/oats-schemas)
 */

import { PatchFooParam1BarParam2ServerRequest, PutFooParam1BarParam2ServerRequest } from './requestServerTypes'
import {
  Delete123ServerResponse,
  DeleteServerResponse,
  GetEmptyServerResponse,
  GetFooServerResponse,
  PatchFooParam1BarParam2ServerResponse,
  PostFooServerResponse,
  PutFooParam1BarParam2ServerResponse,
} from './responseServerTypes'

export type NoOperationIdsApi = {
  getEmpty(): Promise<GetEmptyServerResponse>
  delete(): Promise<DeleteServerResponse>
  delete123(): Promise<Delete123ServerResponse>
  getFoo(): Promise<GetFooServerResponse>
  patchFooParam1BarParam2(request: PatchFooParam1BarParam2ServerRequest): Promise<PatchFooParam1BarParam2ServerResponse>
  postFoo(): Promise<PostFooServerResponse>
  putFooParam1BarParam2(request: PutFooParam1BarParam2ServerRequest): Promise<PutFooParam1BarParam2ServerResponse>
}
