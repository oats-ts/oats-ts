import { cookieFormArray } from './cookie/cookieFormArray'
import { cookieFormObject } from './cookie/cookieFormObject'
import { cookieFormPrimitive } from './cookie/cookieFormPrimitive'
import { headerSimpleArray } from './header/headerSimpleArray'
import { headerSimpleObject } from './header/headerSimpleObject'
import { headerSimplePrimitive } from './header/headerSimplePrimitive'
import { pathLabelArray } from './path/pathLabelArray'
import { pathLabelObject } from './path/pathLabelObject'
import { pathLabelPrimitive } from './path/pathLabelPrimitive'
import { pathMatrixArray } from './path/pathMatrixArray'
import { pathMatrixObject } from './path/pathMatrixObject'
import { pathMatrixPrimitive } from './path/pathMatrixPrimitive'
import { pathSimpleArray } from './path/pathSimpleArray'
import { pathSimpleObject } from './path/pathSimpleObject'
import { pathSimplePrimitive } from './path/pathSimplePrimitive'
import { createQueryString } from './query/createQueryString'
import { queryDeepObject } from './query/queryDeepObjectObject'
import { queryFormArray } from './query/queryFormArray'
import { queryFormObject } from './query/queryFormObject'
import { queryFormPrimitive } from './query/queryFormPrimitive'
import { queryPipeDelimitedArray } from './query/queryPipeDelimitedArray'
import { querySpaceDelimitedArray } from './query/querySpaceDelimitedArray'

export { createQueryString } from './query/createQueryString'

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
    object: queryDeepObject,
  },
}

export const header = {
  simple: {
    primitive: headerSimplePrimitive,
    array: headerSimpleArray,
    object: headerSimpleObject,
  },
}

export const cookie = {
  form: {
    primitive: cookieFormPrimitive,
    array: cookieFormArray,
    object: cookieFormObject,
  },
}

export const path = {
  simple: {
    primitive: pathSimplePrimitive,
    array: pathSimpleArray,
    object: pathSimpleObject,
  },
  matrix: {
    primitive: pathMatrixPrimitive,
    array: pathMatrixArray,
    object: pathMatrixObject,
  },
  label: {
    primitive: pathLabelPrimitive,
    array: pathLabelArray,
    object: pathLabelObject,
  },
}

type X = {
  s: string
  n: number
  b: boolean
  a: string[]
  o: Record<string, number>
}

const querySerializer = createQueryString<X>({
  s: query.form.primitive<string>({}),
  n: query.form.primitive<number>({}),
  b: query.form.primitive<boolean>({}),
  a: query.form.array<string[]>({}),
  o: query.form.object<Record<string, number>>({}),
})

const str = querySerializer({
  s: '',
  n: 1,
  b: true,
  a: [],
  o: {},
})
