/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from edge-cases/status-code-ranges.json (originating from oats-ts/oats-schemas)
 */

import {
  Range1XxServerResponse,
  Range2XxServerResponse,
  Range3XxServerResponse,
  Range4XxServerResponse,
  Range5XxServerResponse,
  WithNormalStatusesServerResponse,
} from './responseServerTypes'

export type StatusCodeRangesApi = {
  withNormalStatuses(): Promise<WithNormalStatusesServerResponse>
  range1Xx(): Promise<Range1XxServerResponse>
  range2Xx(): Promise<Range2XxServerResponse>
  range3Xx(): Promise<Range3XxServerResponse>
  range4Xx(): Promise<Range4XxServerResponse>
  range5Xx(): Promise<Range5XxServerResponse>
}