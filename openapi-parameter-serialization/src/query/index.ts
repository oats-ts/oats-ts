import { queryDeepObjectObject } from './queryDeepObjectObject'
import { queryFormArray } from './queryFormArray'
import { queryFormObject } from './queryFormObject'
import { queryFormPrimitive } from './queryFormPrimitive'
import { queryPipeDelimitedArray } from './queryPipeDelimitedArray'
import { querySpaceDelimitedArray } from './querySpaceDelimitedArray'

export const query = {
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
}
