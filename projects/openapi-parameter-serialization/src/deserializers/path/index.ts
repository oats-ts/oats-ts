import { pathLabelArray } from './pathLabelArray'
import { pathLabelObject } from './pathLabelObject'
import { pathLabelPrimitive } from './pathLabelPrimitive'
import { pathMatrixArray } from './pathMatrixArray'
import { pathMatrixObject } from './pathMatrixObject'
import { pathMatrixPrimitive } from './pathMatrixPrimitive'
import { pathSimpleArray } from './pathSimpleArray'
import { pathSimpleObject } from './pathSimpleObject'
import { pathSimplePrimitive } from './pathSimplePrimitive'

export const path = {
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
}
