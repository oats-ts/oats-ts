/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from edge-cases/status-code-ranges.json (originating from oats-ts/oats-schemas)
 */

import { parameter } from '@oats-ts/openapi-runtime'

export const range1XxResponseHeaderParameters = {
  '1XX': { descriptor: { 'X-Foo': parameter.header.simple.primitive(parameter.value.string()) } },
} as const

export const range2XxResponseHeaderParameters = {
  '2XX': { descriptor: { 'X-Foo': parameter.header.simple.primitive(parameter.value.string()) } },
} as const

export const range3XxResponseHeaderParameters = {
  '3XX': { descriptor: { 'X-Foo': parameter.header.simple.primitive(parameter.value.string()) } },
} as const

export const range4XxResponseHeaderParameters = {
  '4XX': { descriptor: { 'X-Foo': parameter.header.simple.primitive(parameter.value.string()) } },
} as const

export const range5XxResponseHeaderParameters = {
  '5XX': { descriptor: { 'X-Foo': parameter.header.simple.primitive(parameter.value.string()) } },
} as const

export const withNormalStatusesResponseHeaderParameters = {
  400: { descriptor: { 'X-Foo': parameter.header.simple.primitive(parameter.value.string()) } },
  401: { descriptor: { 'X-Foo': parameter.header.simple.primitive(parameter.value.string()) } },
  403: { descriptor: { 'X-Foo': parameter.header.simple.primitive(parameter.value.string()) } },
  500: { descriptor: { 'X-Foo': parameter.header.simple.primitive(parameter.value.string()) } },
  '4XX': { descriptor: { 'X-Foo': parameter.header.simple.primitive(parameter.value.string()) } },
} as const