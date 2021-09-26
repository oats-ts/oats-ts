import { queryDelimitedArray } from './queryDelmitedArray'
import { queryFormObject } from './queryFormObject'
import { queryFormPrimitive } from './queryFormPrimitive'

export const query = {
  form: {
    array: queryDelimitedArray(','),
    object: queryFormObject,
    primitive: queryFormPrimitive,
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
