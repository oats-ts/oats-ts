import { headerSimpleArray } from '../deserializers/header/headerSimpleArray'
import { headerSimpleObject } from '../deserializers/header/headerSimpleObject'
import { headerSimplePrimitive } from '../deserializers/header/headerSimplePrimitive'
import { pathLabelArray } from '../deserializers/path/pathLabelArray'
import { pathLabelObject } from '../deserializers/path/pathLabelObject'
import { pathLabelPrimitive } from '../deserializers/path/pathLabelPrimitive'
import { pathMatrixArray } from '../deserializers/path/pathMatrixArray'
import { pathMatrixObject } from '../deserializers/path/pathMatrixObject'
import { pathMatrixPrimitive } from '../deserializers/path/pathMatrixPrimitive'
import { pathSimpleArray } from '../deserializers/path/pathSimpleArray'
import { pathSimpleObject } from '../deserializers/path/pathSimpleObject'
import { pathSimplePrimitive } from '../deserializers/path/pathSimplePrimitive'
import { queryDeepObjectObject } from '../deserializers/query/queryDeepObjectObject'
import { queryFormArray } from '../deserializers/query/queryFormArray'
import { queryFormObject } from '../deserializers/query/queryFormObject'
import { queryFormPrimitive } from '../deserializers/query/queryFormPrimitive'
import { queryPipeDelimitedArray } from '../deserializers/query/queryPipeDelimitedArray'
import { querySpaceDelimitedArray } from '../deserializers/query/querySpaceDelimitedArray'
import {
  PrimitiveDeserializerFactory,
  DslStyle,
  RawHeaders,
  ArrayDeserializerFactory,
  ObjectDeserializerFactory,
  RawPathParams,
  RawQueryParams,
} from './types'

type DeserializersByLocation = Partial<{
  header: DeserializersByStyle<RawHeaders>
  path: DeserializersByStyle<RawPathParams>
  query: DeserializersByStyle<RawQueryParams>
  cookie: DeserializersByStyle<any> // TODO
}>
type DeserializersByStyle<I> = Partial<Record<DslStyle, DeserializersByType<I>>>
type DeserializersByType<I> = Partial<{
  primitive: PrimitiveDeserializerFactory<I, any>
  array: ArrayDeserializerFactory<I, any>
  object: ObjectDeserializerFactory<I, any>
}>

export const deserializers: DeserializersByLocation = {
  header: {
    simple: {
      primitive: headerSimplePrimitive,
      array: headerSimpleArray,
      object: headerSimpleObject,
    },
  },
  path: {
    simple: {
      primitive: pathSimplePrimitive,
      array: pathSimpleArray,
      object: pathSimpleObject,
    },
    label: {
      primitive: pathLabelPrimitive,
      array: pathLabelArray,
      object: pathLabelObject,
    },
    matrix: {
      primitive: pathMatrixPrimitive,
      array: pathMatrixArray,
      object: pathMatrixObject,
    },
  },
  query: {
    form: {
      primitive: queryFormPrimitive,
      array: queryFormArray,
      object: queryFormObject,
    },
    spaceDelimited: {
      array: querySpaceDelimitedArray,
    },
    pipeDelimited: {
      array: queryPipeDelimitedArray,
    },
    deepObject: {
      object: queryDeepObjectObject,
    },
  },
}
