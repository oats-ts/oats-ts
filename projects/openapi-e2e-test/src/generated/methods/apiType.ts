/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/methods.json (originating from oats-ts/oats-schemas)
 */

import {
  DeleteMethodServerResponse,
  GetMethodServerResponse,
  PatchMethodServerResponse,
  PostMethodServerResponse,
  PutMethodServerResponse,
} from './responseServerTypes'

export type HttpMethodsApi = {
  deleteMethod(): Promise<DeleteMethodServerResponse>
  getMethod(): Promise<GetMethodServerResponse>
  patchMethod(): Promise<PatchMethodServerResponse>
  postMethod(): Promise<PostMethodServerResponse>
  putMethod(): Promise<PutMethodServerResponse>
}
