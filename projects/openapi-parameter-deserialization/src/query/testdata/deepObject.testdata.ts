import { QueryErrorData, QuerySuccessData, QueryTestData } from '../query.testutils'
import { OptObjectFieldObj, TestDataObject, TypesObject } from '../../testTypes'

const explodeOptionalObjectOk: QuerySuccessData<OptObjectFieldObj>[] = [
  [
    { value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } },
    '?value[s]=str&value[n]=10&value[b]=true&value[e]=dog&value[l]=cat',
  ],
  [{ value: { n: 10, b: true, e: 'dog', l: 'cat' } }, '?value[n]=10&value[b]=true&value[e]=dog&value[l]=cat'],
  [{ value: { b: true, e: 'dog', l: 'cat' } }, '?value[b]=true&value[e]=dog&value[l]=cat'],
  [{ value: { e: 'dog', l: 'cat' } }, '?value[e]=dog&value[l]=cat'],
  [{ value: { l: 'cat' } }, '?value[l]=cat'],
  [{ value: {} }, ''],
]

const explodeRequiredObjectOk: QuerySuccessData<OptObjectFieldObj>[] = [
  [
    { value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } },
    '?value[s]=str&value[n]=10&value[b]=true&value[e]=dog&value[l]=cat',
  ],
]

const explodeRequiredObjectError: QueryErrorData[] = [
  ['?value=dog'],
  ['?value[s]=x&value[n]=x&value[b]=x&value[e]=x&value[l]=x'],
  ['?value[n]=10&value[b]=true&value[e]=dog&value[l]=cat'],
  ['?value[b]=true&value[e]=dog&value[l]=cat'],
  ['?value[e]=dog&value[l]=cat'],
  ['?value[l]=cat'],
]

const explodeOptionalObjectError: QueryErrorData[] = [['?value[s]=x&value[n]=x&value[b]=x&value[e]=x&value[l]=x']]

const explodeRequired: TypesObject<QueryTestData<any>> = {
  object: {
    optionalFields: {
      data: explodeOptionalObjectOk,
      error: explodeOptionalObjectError,
    },
    requiredFields: {
      data: explodeRequiredObjectOk,
      error: explodeRequiredObjectError,
    },
  },
}
const explodeOptional: TypesObject<QueryTestData<any>> = {
  object: {
    optionalFields: {
      data: explodeOptionalObjectOk,
      error: explodeOptionalObjectError,
    },
    requiredFields: {
      data: explodeRequiredObjectOk,
      error: explodeRequiredObjectError,
    },
  },
}

export const deepObjectTestData: TestDataObject<QueryTestData<any>> = {
  explode: {
    required: explodeRequired,
    optional: explodeOptional,
  },
}
