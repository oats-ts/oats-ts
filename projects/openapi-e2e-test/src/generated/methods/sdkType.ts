/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/methods.json (originating from oats-ts/oats-schemas)
 */

import {
  DeleteMethodResponse,
  GetMethodResponse,
  PatchMethodResponse,
  PostMethodResponse,
  PutMethodResponse,
} from './responseTypes'

export type HttpMethodsSdk = {
  getMethod(): Promise<GetMethodResponse>
  postMethod(): Promise<PostMethodResponse>
  putMethod(): Promise<PutMethodResponse>
  patchMethod(): Promise<PatchMethodResponse>
  deleteMethod(): Promise<DeleteMethodResponse>
}
