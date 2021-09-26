import { queryDelimitedArray } from './queryDelmitedArray'
import { queryFormObject } from './queryFormObject'
import { queryFormPrimitive } from './queryFormPrimitive'

export const query = {
  form: {
    primitive: queryFormPrimitive,
    array: queryDelimitedArray(','),
    object: queryFormObject,
  },
  spaceDelimited: {
    array: queryDelimitedArray(encodeURIComponent(' ')),
  },
  pipeDelimited: {
    array: queryDelimitedArray('|'),
  },
  deepObject: {
    // object: queryDeepObjectObject,
  },
}
