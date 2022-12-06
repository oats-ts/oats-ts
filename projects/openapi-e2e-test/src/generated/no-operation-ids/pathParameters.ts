/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from edge-cases/no-operation-ids.json (originating from oats-ts/oats-schemas)
 */

import { PathParameters, parameter, parsePathToMatcher, parsePathToSegments } from '@oats-ts/openapi-runtime'
import { PatchFooParam1BarParam2PathParameters, PutFooParam1BarParam2PathParameters } from './pathTypes'

export const patchFooParam1BarParam2PathParameters: PathParameters<PatchFooParam1BarParam2PathParameters> = {
  descriptor: {
    param1: parameter.path.simple.required.primitive(parameter.value.string()),
    param2: parameter.path.simple.required.primitive(parameter.value.string()),
  },
  matcher: parsePathToMatcher('/foo/{param1}/bar/{param2}'),
  pathSegments: parsePathToSegments('/foo/{param1}/bar/{param2}'),
}

export const putFooParam1BarParam2PathParameters: PathParameters<PutFooParam1BarParam2PathParameters> = {
  descriptor: {
    param1: parameter.path.simple.required.primitive(parameter.value.string()),
    param2: parameter.path.simple.required.primitive(parameter.value.string()),
  },
  matcher: parsePathToMatcher('/foo/{param1}/bar/{param2}'),
  pathSegments: parsePathToSegments('/foo/{param1}/bar/{param2}'),
}