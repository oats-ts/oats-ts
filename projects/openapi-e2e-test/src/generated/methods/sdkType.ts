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
  deleteMethod(): Promise<DeleteMethodResponse>
  getMethod(): Promise<GetMethodResponse>
  patchMethod(): Promise<PatchMethodResponse>
  postMethod(): Promise<PostMethodResponse>
  putMethod(): Promise<PutMethodResponse>
}
