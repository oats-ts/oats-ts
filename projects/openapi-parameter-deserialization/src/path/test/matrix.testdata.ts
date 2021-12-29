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
  [{ value: 'hello' }, p(';value=hello')],
  [{ value: 'hello test' }, p(';value=hello%20test')],
]

const numberOk: PathSuccessData<NumberFieldObj>[] = [
  [{ value: 10 }, p(';value=10')],
  [{ value: 10.27 }, p(';value=10.27')],
]

const booleanOk: PathSuccessData<BooleanFieldObj>[] = [
  [{ value: false }, p(';value=false')],
  [{ value: true }, p(';value=true')],
]

const literalOk: PathSuccessData<LiteralFieldObj>[] = [[{ value: 'cat' }, p(';value=cat')]]

const enumOk: PathSuccessData<EnumFieldObj>[] = [
  [{ value: 'cat' }, p(';value=cat')],
  [{ value: 'dog' }, p(';value=dog')],
  [{ value: 'racoon' }, p(';value=racoon')],
]

const noExplodeStringArrayOk: PathSuccessData<StringArrayFieldObj>[] = [
  [{ value: ['foo', 'bar', 'foobar'] }, p(';value=foo,bar,foobar')],
]

const noExplodeNumberArrayOk: PathSuccessData<NumberArrayFieldObj>[] = [
  [{ value: [1, 2, 3] }, p(';value=1,2,3')],
  [{ value: [1.2, 3.4, 5.998] }, p(';value=1%2E2,3%2E4,5%2E998')],
]

const noExplodeBooleanArrayOk: PathSuccessData<BooleanArrayFieldObj>[] = [
  [{ value: [true, false] }, p(';value=true,false')],
]

const noExplodeLiteralArrayOk: PathSuccessData<LiteralArrayFieldObj>[] = [
  [{ value: ['cat', 'cat'] }, p(';value=cat,cat')],
]

const noExplodeEnumArrayOk: PathSuccessData<EnumArrayFieldObj>[] = [
  [{ value: ['cat', 'dog', 'racoon'] }, p(';value=cat,dog,racoon')],
  [{ value: ['cat'] }, p(';value=cat')],
]

const explodeStringArrayOk: PathSuccessData<StringArrayFieldObj>[] = [
  [{ value: ['foo', 'bar', 'foobar'] }, p(';value=foo;value=bar;value=foobar')],
]

const explodeNumberArrayOk: PathSuccessData<NumberArrayFieldObj>[] = [
  [{ value: [1, 2, 3] }, p(';value=1;value=2;value=3')],
  [{ value: [1.2, 3.4, 5.998] }, p(';value=1%2E2;value=3%2E4;value=5%2E998')],
]

const explodeBooleanArrayOk: PathSuccessData<BooleanArrayFieldObj>[] = [
  [{ value: [true, false] }, p(';value=true;value=false')],
]

const explodeLiteralArrayOk: PathSuccessData<LiteralArrayFieldObj>[] = [
  [{ value: ['cat', 'cat'] }, p(';value=cat;value=cat')],
]

const explodeEnumArrayOk: PathSuccessData<EnumArrayFieldObj>[] = [
  [{ value: ['cat', 'dog', 'racoon'] }, p(';value=cat;value=dog;value=racoon')],
  [{ value: ['cat'] }, p(';value=cat')],
]

const explodeOptionalObjectOk: PathSuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, p(';s=str;n=10;b=true;e=dog;l=cat')],
  [{ value: { n: 10, b: true, e: 'dog', l: 'cat' } }, p(';n=10;b=true;e=dog;l=cat')],
  [{ value: { b: true, e: 'dog', l: 'cat' } }, p(';b=true;e=dog;l=cat')],
  [{ value: { e: 'dog', l: 'cat' } }, p(';e=dog;l=cat')],
  [{ value: { l: 'cat' } }, p(';l=cat')],
]

const explodeRequiredObjectOk: PathSuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, p(';s=str;n=10;b=true;e=dog;l=cat')],
]

const noExplodeOptionalObjectOk: PathSuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, p(';value=s,str,n,10,b,true,l,cat,e,dog')],
  [{ value: { n: 10, b: true, e: 'dog', l: 'cat' } }, p(';value=n,10,b,true,l,cat,e,dog')],
  [{ value: { b: true, e: 'dog', l: 'cat' } }, p(';value=b,true,l,cat,e,dog')],
  [{ value: { e: 'dog', l: 'cat' } }, p(';value=l,cat,e,dog')],
]

const noExplodeRequiredObjectOk: PathSuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, p(';value=s,str,n,10,b,true,l,cat,e,dog')],
]

const requiredError: PathErrorData[] = [[''], ['/test/'], ['/test/x']]

const numberError: PathErrorData[] = [[p('cat')], [p('false')], [p('c11')]]

const booleanError: PathErrorData[] = [[p('cat')], [p('12343')], [p('cfalse')], [p('fAlSE')]]

const literalError: PathErrorData[] = [[p('dog')], [p('12432')], [p('cfalse')], [p('FaLSe')]]

const enumError: PathErrorData[] = [[p('_cat')], [p('1')], [p('CaT')], [p('DOG')], [p('true')]]

const explodeRequired: TypesObject<PathTestData<any>> = {
  primitive: {
    string: { data: stringOk, error: [...requiredError] },
    number: { data: numberOk, error: [...requiredError, ...numberError] },
    boolean: { data: booleanOk, error: [...requiredError, ...booleanError] },
    literal: { data: literalOk, error: [...requiredError, ...literalError] },
    enumeration: { data: enumOk, error: [...requiredError, ...enumError] },
  },
  array: {
    string: { data: explodeStringArrayOk, error: [] },
    number: { data: explodeNumberArrayOk, error: [] },
    boolean: { data: explodeBooleanArrayOk, error: [] },
    literal: { data: explodeLiteralArrayOk, error: [] },
    enumeration: { data: explodeEnumArrayOk, error: [] },
  },
  object: {
    optionalFields: { data: explodeOptionalObjectOk, error: [] },
    requiredFields: { data: explodeRequiredObjectOk, error: [] },
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
    string: { data: noExplodeStringArrayOk, error: [] },
    number: { data: noExplodeNumberArrayOk, error: [] },
    boolean: { data: noExplodeBooleanArrayOk, error: [] },
    literal: { data: noExplodeLiteralArrayOk, error: [] },
    enumeration: { data: noExplodeEnumArrayOk, error: [] },
  },
  object: {
    optionalFields: { data: noExplodeOptionalObjectOk, error: [] },
    requiredFields: { data: noExplodeRequiredObjectOk, error: [] },
  },
}

export const matrixTestData: TestDataObject<PathTestData<any>> = {
  explode: {
    required: explodeRequired,
  },
  noExplode: {
    required: noExplodeRequired,
  },
}
