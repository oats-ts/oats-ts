import { p, PathErrorData, PathSuccessData, PathTestData } from './path.testutils'
import {
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

const stringOk: PathSuccessData<StringFieldObj>[] = [
  [{ value: 'hello' }, p('hello')],
  [{ value: 'hello test' }, p('hello%20test')],
]

const numberOk: PathSuccessData<NumberFieldObj>[] = [
  [{ value: 10 }, p('10')],
  [{ value: 10.27 }, p('10.27')],
]

const booleanOk: PathSuccessData<BooleanFieldObj>[] = [
  [{ value: false }, p('false')],
  [{ value: true }, p('true')],
]

const literalOk: PathSuccessData<LiteralFieldObj>[] = [[{ value: 'cat' }, p('cat')]]

const enumOk: PathSuccessData<EnumFieldObj>[] = [
  [{ value: 'cat' }, p('cat')],
  [{ value: 'dog' }, p('dog')],
  [{ value: 'racoon' }, p('racoon')],
]

const stringArrayOk: PathSuccessData<StringArrayFieldObj>[] = [
  [{ value: ['foo', 'bar', 'foobar'] }, p('foo,bar,foobar')],
]

const numberArrayOk: PathSuccessData<NumberArrayFieldObj>[] = [
  [{ value: [1, 2, 3] }, p('1,2,3')],
  [{ value: [1.2, 3.4, 5.998] }, p('1.2,3.4,5.998')],
]

const booleanArrayOk: PathSuccessData<BooleanArrayFieldObj>[] = [[{ value: [true, false] }, p('true,false')]]

const literalArrayOk: PathSuccessData<LiteralArrayFieldObj>[] = [[{ value: ['cat', 'cat'] }, p('cat,cat')]]

const enumArrayOk: PathSuccessData<EnumArrayFieldObj>[] = [
  [{ value: ['cat', 'dog', 'racoon'] }, p('cat,dog,racoon')],
  [{ value: ['cat'] }, p('cat')],
]

const explodeOptionalObjectOk: PathSuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, p('s=str,n=10,b=true,e=dog,l=cat')],
  [{ value: { n: 10, b: true, e: 'dog', l: 'cat' } }, p('n=10,b=true,e=dog,l=cat')],
  [{ value: { b: true, e: 'dog', l: 'cat' } }, p('b=true,e=dog,l=cat')],
  [{ value: { e: 'dog', l: 'cat' } }, p('e=dog,l=cat')],
  [{ value: { l: 'cat' } }, p('l=cat')],
]

const explodeRequiredObjectOk: PathSuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, p('s=str,n=10,b=true,e=dog,l=cat')],
]

const noExplodeOptionalObjectOk: PathSuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, p('s,str,n,10,b,true,l,cat,e,dog')],
  [{ value: { n: 10, b: true, e: 'dog', l: 'cat' } }, p('n,10,b,true,l,cat,e,dog')],
  [{ value: { b: true, e: 'dog', l: 'cat' } }, p('b,true,l,cat,e,dog')],
  [{ value: { e: 'dog', l: 'cat' } }, p('l,cat,e,dog')],
]

const noExplodeRequiredObjectOk: PathSuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, p('s,str,n,10,b,true,l,cat,e,dog')],
]

const requiredError: PathErrorData[] = [[''], ['/test/'], ['/test/x']]

const numberError: PathErrorData[] = [[p('cat')], [p('false')], [p('c11')]]

const booleanError: PathErrorData[] = [[p('cat')], [p('12343')], [p('cfalse')], [p('fAlSE')]]

const literalError: PathErrorData[] = [[p('dog')], [p('12432')], [p('cfalse')], [p('FaLSe')]]

const enumError: PathErrorData[] = [[p('_cat')], [p('1')], [p('CaT')], [p('DOG')], [p('true')]]

const numberArrayError: PathErrorData[] = [[p('1,cat')], [p('cat,2')], [p('c11')]]

const booleanArrayError: PathErrorData[] = [[p('cat,true')], [p('false,11')], [p('FaLse')]]

const literalArrayError: PathErrorData[] = [[p('dog,asd')], [p('false,cat')]]

const enumArrayError: PathErrorData[] = [[p('_cat,dog')], [p('cat,1')], [p('CaT')], [p('DOG')]]

const explodeRequiredObjectError: PathErrorData[] = [
  [p('value=dog')],
  [p('s=x,n=x,b=x,e=x,l=x')],
  [p('n=10,b=true,e=dog,l=cat')],
  [p('b=true,e=dog,l=cat')],
  [p('e=dog,l=cat')],
  [p('l=cat')],
]

const explodeOptionalObjectError: PathErrorData[] = [[p('s=x,n=x,b=x,e=x,l=x')]]

const explodeRequired: TypesObject<PathTestData<any>> = {
  primitive: {
    string: { data: stringOk, error: [...requiredError] },
    number: { data: numberOk, error: [...requiredError, ...numberError] },
    boolean: { data: booleanOk, error: [...requiredError, ...booleanError] },
    literal: { data: literalOk, error: [...requiredError, ...literalError] },
    enumeration: { data: enumOk, error: [...requiredError, ...enumError] },
  },
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

const noExplodeRequired: TypesObject<PathTestData<any>> = {
  primitive: {
    string: { data: stringOk, error: [...requiredError] },
    number: { data: numberOk, error: [...requiredError, ...numberError] },
    boolean: { data: booleanOk, error: [...requiredError, ...booleanError] },
    literal: { data: literalOk, error: [...requiredError, ...literalError] },
    enumeration: { data: enumOk, error: [...requiredError, ...enumError] },
  },
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

export const simpleTestData: TestDataObject<PathTestData<any>> = {
  explode: {
    required: explodeRequired,
  },
  noExplode: {
    required: noExplodeRequired,
  },
}
