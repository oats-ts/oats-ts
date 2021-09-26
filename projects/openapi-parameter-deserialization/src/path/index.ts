import { pathSimpleArray } from './pathSimpleArray'
import { pathSimpleObject } from './pathSimpleObject'
import { pathSimplePrimitive } from './pathSimplePrimitive'

export const path = {
  simple: {
    array: pathSimpleArray,
    object: pathSimpleObject,
    primitive: pathSimplePrimitive,
  },
  label: {},
  matrix: {},
}
