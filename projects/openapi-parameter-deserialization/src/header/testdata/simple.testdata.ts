import { h, HeaderErrorData, HeaderSuccessData, HeaderTestData } from '../header.testutils'
import {
  AnyFieldObj,
  BooleanArrayFieldObj,
  BooleanFieldObj,
  EnumArrayFieldObj,
  EnumFieldObj,
  LiteralArrayFieldObj,
  LiteralFieldObj,
  NumberArrayFieldObj,
  NumberFieldObj,
  OptObjectFieldObj,
  StringArrayFieldObj,
  StringFieldObj,
  TestDataObject,
  TypesObject,
} from '../../testTypes'

const optionalOk: HeaderSuccessData<AnyFieldObj>[] = [[{ value: undefined }, { unrelated: '10' }]]

const stringOk: HeaderSuccessData<StringFieldObj>[] = [
  [{ value: 'hello' }, h('hello')],
  [{ value: 'hello test' }, h('hello%20test')],
]

const numberOk: HeaderSuccessData<NumberFieldObj>[] = [
  [{ value: 10 }, h('10')],
  [{ value: 10.27 }, h('10.27')],
]

const booleanOk: HeaderSuccessData<BooleanFieldObj>[] = [
  [{ value: false }, h('false')],
  [{ value: true }, h('true')],
]

const literalOk: HeaderSuccessData<LiteralFieldObj>[] = [[{ value: 'cat' }, h('cat')]]

const enumOk: HeaderSuccessData<EnumFieldObj>[] = [
  [{ value: 'cat' }, h('cat')],
  [{ value: 'dog' }, h('dog')],
  [{ value: 'racoon' }, h('racoon')],
]

const stringArrayOk: HeaderSuccessData<StringArrayFieldObj>[] = [
  [{ value: ['foo', 'bar', 'foobar'] }, h('foo,bar,foobar')],
]

const numberArrayOk: HeaderSuccessData<NumberArrayFieldObj>[] = [
  [{ value: [1, 2, 3] }, h('1,2,3')],
  [{ value: [1.2, 3.4, 5.998] }, h('1.2,3.4,5.998')],
]

const booleanArrayOk: HeaderSuccessData<BooleanArrayFieldObj>[] = [[{ value: [true, false] }, h('true,false')]]

const literalArrayOk: HeaderSuccessData<LiteralArrayFieldObj>[] = [[{ value: ['cat', 'cat'] }, h('cat,cat')]]

const enumArrayOk: HeaderSuccessData<EnumArrayFieldObj>[] = [
  [{ value: ['cat', 'dog', 'racoon'] }, h('cat,dog,racoon')],
  [{ value: ['cat'] }, h('cat')],
]

const explodeOptionalObjectOk: HeaderSuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, h('s=str,n=10,b=true,e=dog,l=cat')],
  [{ value: { n: 10, b: true, e: 'dog', l: 'cat' } }, h('n=10,b=true,e=dog,l=cat')],
  [{ value: { b: true, e: 'dog', l: 'cat' } }, h('b=true,e=dog,l=cat')],
  [{ value: { e: 'dog', l: 'cat' } }, h('e=dog,l=cat')],
  [{ value: { l: 'cat' } }, h('l=cat')],
]

const explodeRequiredObjectOk: HeaderSuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, h('s=str,n=10,b=true,e=dog,l=cat')],
]

const noExplodeOptionalObjectOk: HeaderSuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, h('s,str,n,10,b,true,l,cat,e,dog')],
  [{ value: { n: 10, b: true, e: 'dog', l: 'cat' } }, h('n,10,b,true,l,cat,e,dog')],
  [{ value: { b: true, e: 'dog', l: 'cat' } }, h('b,true,l,cat,e,dog')],
  [{ value: { e: 'dog', l: 'cat' } }, h('l,cat,e,dog')],
]

const noExplodeRequiredObjectOk: HeaderSuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, h('s,str,n,10,b,true,l,cat,e,dog')],
]

const requiredError: HeaderErrorData[] = [[{}], [{ unrelated: 'hello' }]]

const numberError: HeaderErrorData[] = [[h('cat')], [h('false')], [h('c11')]]

const booleanError: HeaderErrorData[] = [[h('cat')], [h('12432')], [h('cfalse')], [h('FaLsE')]]

const literalError: HeaderErrorData[] = [[h('dog')], [h('12432')], [h('cfalse')], [h('FaLsE')]]

const enumError: HeaderErrorData[] = [[h('_cat')], [h('1')], [h('CaT')], [h('DOG')], [h('true')]]

const numberArrayError: HeaderErrorData[] = [[h('1,cat')], [h('cat,2')], [h('c11')]]

const booleanArrayError: HeaderErrorData[] = [[h('cat,true')], [h('false,11')], [h('FaLse')]]

const literalArrayError: HeaderErrorData[] = [[h('dog,asd')], [h('false,cat')]]

const enumArrayError: HeaderErrorData[] = [[h('_cat,dog')], [h('cat,1')], [h('CaT')], [h('DOG')]]

const explodeRequiredObjectError: HeaderErrorData[] = [
  [h('value=dog')],
  [h('s=x,n=x,b=x,e=x,l=x')],
  [h('n=10,b=true,e=dog,l=cat')],
  [h('b=true,e=dog,l=cat')],
  [h('e=dog,l=cat')],
  [h('l=cat')],
]

const explodeOptionalObjectError: HeaderErrorData[] = [[h('s=x,n=x,b=x,e=x,l=x')]]

const explodeRequired: TypesObject<HeaderTestData<any>> = {
  string: { data: stringOk, error: [...requiredError] },
  number: { data: numberOk, error: [...requiredError, ...numberError] },
  boolean: { data: booleanOk, error: [...requiredError, ...booleanError] },
  literal: { data: literalOk, error: [...requiredError, ...literalError] },
  enumeration: { data: enumOk, error: [...requiredError, ...enumError] },
  array: {
    string: { data: stringArrayOk, error: [] },
    number: { data: numberArrayOk, error: numberArrayError },
    boolean: { data: booleanArrayOk, error: booleanArrayError },
    literal: { data: literalArrayOk, error: literalArrayError },
    enumeration: { data: enumArrayOk, error: enumArrayError },
  },
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
const explodeOptional: TypesObject<HeaderTestData<any>> = {
  string: { data: [...optionalOk, ...stringOk], error: [] },
  number: { data: [...optionalOk, ...numberOk], error: numberError },
  boolean: { data: [...optionalOk, ...booleanOk], error: booleanError },
  literal: { data: [...optionalOk, ...literalOk], error: literalError },
  enumeration: { data: [...optionalOk, ...enumOk], error: enumError },
  array: {
    string: { data: stringArrayOk, error: [] },
    number: { data: numberArrayOk, error: numberArrayError },
    boolean: { data: booleanArrayOk, error: booleanArrayError },
    literal: { data: literalArrayOk, error: literalArrayError },
    enumeration: { data: enumArrayOk, error: enumArrayError },
  },
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

const noExplodeRequired: TypesObject<HeaderTestData<any>> = {
  string: { data: stringOk, error: [...requiredError] },
  number: { data: numberOk, error: [...requiredError, ...numberError] },
  boolean: { data: booleanOk, error: [...requiredError, ...booleanError] },
  literal: { data: literalOk, error: [...requiredError, ...literalError] },
  enumeration: { data: enumOk, error: [...requiredError, ...enumError] },
  array: {
    string: { data: stringArrayOk, error: [] },
    number: { data: numberArrayOk, error: numberArrayError },
    boolean: { data: booleanArrayOk, error: booleanArrayError },
    literal: { data: literalArrayOk, error: literalArrayError },
    enumeration: { data: enumArrayOk, error: enumArrayError },
  },
  object: {
    optionalFields: { data: noExplodeOptionalObjectOk, error: [] },
    requiredFields: { data: noExplodeRequiredObjectOk, error: [] },
  },
}

const noExplodeOptional: TypesObject<HeaderTestData<any>> = {
  string: { data: [...optionalOk, ...stringOk], error: [] },
  number: { data: [...optionalOk, ...numberOk], error: numberError },
  boolean: { data: [...optionalOk, ...booleanOk], error: booleanError },
  literal: { data: [...optionalOk, ...literalOk], error: literalError },
  enumeration: { data: [...optionalOk, ...enumOk], error: enumError },
  array: {
    string: { data: stringArrayOk, error: [] },
    number: { data: numberArrayOk, error: numberArrayError },
    boolean: { data: booleanArrayOk, error: booleanArrayError },
    literal: { data: literalArrayOk, error: literalArrayError },
    enumeration: { data: enumArrayOk, error: enumArrayError },
  },
  object: {
    optionalFields: { data: [...noExplodeOptionalObjectOk, [{ value: {} }, h('')]], error: [] },
    requiredFields: { data: noExplodeRequiredObjectOk, error: [] },
  },
}

export const simpleTestData: TestDataObject<HeaderTestData<any>> = {
  explode: {
    required: explodeRequired,
    optional: explodeOptional,
  },
  noExplode: {
    required: noExplodeRequired,
    optional: noExplodeOptional,
  },
}
