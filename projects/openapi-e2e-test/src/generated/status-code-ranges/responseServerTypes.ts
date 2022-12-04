/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from edge-cases/status-code-ranges.json (originating from oats-ts/oats-schemas)
 */

import { StatusCode1XX, StatusCode2XX, StatusCode3XX, StatusCode4XX, StatusCode5XX } from '@oats-ts/openapi-runtime'
import {
  Range1Xx1XxResponseHeaderParameters,
  Range2Xx2XxResponseHeaderParameters,
  Range3Xx3XxResponseHeaderParameters,
  Range4Xx4XxResponseHeaderParameters,
  Range5Xx5XxResponseHeaderParameters,
  WithNormalStatuses400ResponseHeaderParameters,
  WithNormalStatuses401ResponseHeaderParameters,
  WithNormalStatuses403ResponseHeaderParameters,
  WithNormalStatuses4XxResponseHeaderParameters,
  WithNormalStatuses500ResponseHeaderParameters,
} from './responseHeaderTypes'

export type Range1XxServerResponse = {
  statusCode: StatusCode1XX
  mimeType: 'application/json'
  body: string
  headers?: Range1Xx1XxResponseHeaderParameters
}

export type Range2XxServerResponse = {
  statusCode: StatusCode2XX
  mimeType: 'application/json'
  body: string
  headers?: Range2Xx2XxResponseHeaderParameters
}

export type Range3XxServerResponse = {
  statusCode: StatusCode3XX
  mimeType: 'application/json'
  body: string
  headers?: Range3Xx3XxResponseHeaderParameters
}

export type Range4XxServerResponse = {
  statusCode: StatusCode4XX
  mimeType: 'application/json'
  body: string
  headers?: Range4Xx4XxResponseHeaderParameters
}

export type Range5XxServerResponse = {
  statusCode: StatusCode5XX
  mimeType: 'application/json'
  body: string
  headers?: Range5Xx5XxResponseHeaderParameters
}

export type WithNormalStatusesServerResponse =
  | {
      statusCode: 400
      mimeType: 'application/json'
      body: string
      headers?: WithNormalStatuses400ResponseHeaderParameters
    }
  | {
      statusCode: 401
      mimeType: 'application/json'
      body: string
      headers?: WithNormalStatuses401ResponseHeaderParameters
    }
  | {
      statusCode: 403
      mimeType: 'application/json'
      body: string
      headers?: WithNormalStatuses403ResponseHeaderParameters
    }
  | {
      statusCode: 500
      mimeType: 'application/json'
      body: string
      headers?: WithNormalStatuses500ResponseHeaderParameters
    }
  | {
      statusCode: Exclude<StatusCode4XX, 400 | 401 | 403>
      mimeType: 'application/json'
      body: string
      headers?: WithNormalStatuses4XxResponseHeaderParameters
    }
