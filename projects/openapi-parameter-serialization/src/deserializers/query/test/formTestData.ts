import { QueryErrorData, QuerySuccessData, QueryTestData } from './queryTestUtils'
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
} from '../../test/testTypes'

const optionalOk: QuerySuccessData<AnyFieldObj>[] = [
  [{ value: undefined }, ''],
  [{ value: undefined }, '?unrelated=10'],
]

const stringOk: QuerySuccessData<StringFieldObj>[] = [
  [{ value: 'hello' }, '?value=hello'],
  [{ value: 'hello test' }, '?value=hello%20test'],
]

const numberOk: QuerySuccessData<NumberFieldObj>[] = [
  [{ value: 10 }, '?value=10'],
  [{ value: 10.27 }, '?value=10.27'],
]

const booleanOk: QuerySuccessData<BooleanFieldObj>[] = [
  [{ value: false }, '?value=false'],
  [{ value: true }, '?value=true'],
]

const literalOk: QuerySuccessData<LiteralFieldObj>[] = [[{ value: 'cat' }, '?value=cat']]

const enumOk: QuerySuccessData<EnumFieldObj>[] = [
  [{ value: 'cat' }, '?value=cat'],
  [{ value: 'dog' }, '?value=dog'],
  [{ value: 'racoon' }, '?value=racoon'],
]

const explodeStringArrayOk: QuerySuccessData<StringArrayFieldObj>[] = [
  [{ value: ['foo', 'bar', 'foobar'] }, '?value=foo&value=bar&value=foobar'],
  [{ value: undefined }, ''],
]

const explodeNumberArrayOk: QuerySuccessData<NumberArrayFieldObj>[] = [
  [{ value: [1, 2, 3] }, '?value=1&value=2&value=3'],
  [{ value: [1.2, 3.4, 5.998] }, '?value=1.2&value=3.4&value=5.998'],
  [{ value: undefined }, ''],
]

const explodeBooleanArrayOk: QuerySuccessData<BooleanArrayFieldObj>[] = [
  [{ value: [true, false] }, '?value=true&value=false'],
  [{ value: undefined }, ''],
]

const explodeLiteralArrayOk: QuerySuccessData<LiteralArrayFieldObj>[] = [
  [{ value: ['cat', 'cat'] }, '?value=cat&value=cat'],
  [{ value: undefined }, ''],
]

const explodeEnumArrayOk: QuerySuccessData<EnumArrayFieldObj>[] = [
  [{ value: ['cat', 'dog', 'racoon'] }, '?value=cat&value=dog&value=racoon'],
  [{ value: ['cat'] }, '?value=cat'],
  [{ value: undefined }, ''],
]

const noExplodeStringArrayOk: QuerySuccessData<StringArrayFieldObj>[] = [
  [{ value: ['foo', 'bar', 'foobar'] }, '?value=foo,bar,foobar'],
]

const noExplodeNumberArrayOk: QuerySuccessData<NumberArrayFieldObj>[] = [
  [{ value: [1, 2, 3] }, '?value=1,2,3'],
  [{ value: [1.2, 3.4, 5.998] }, '?value=1.2,3.4,5.998'],
]

const noExplodeBooleanArrayOk: QuerySuccessData<BooleanArrayFieldObj>[] = [
  [{ value: [true, false] }, '?value=true,false'],
]

const noExplodeLiteralArrayOk: QuerySuccessData<LiteralArrayFieldObj>[] = [
  [{ value: ['cat', 'cat'] }, '?value=cat,cat'],
]

const noExplodeEnumArrayOk: QuerySuccessData<EnumArrayFieldObj>[] = [
  [{ value: ['cat', 'dog', 'racoon'] }, '?value=cat,dog,racoon'],
  [{ value: ['cat'] }, '?value=cat'],
]

const explodeOptionalObjectOk: QuerySuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, '?s=str&n=10&b=true&e=dog&l=cat'],
  [{ value: { n: 10, b: true, e: 'dog', l: 'cat' } }, '?n=10&b=true&e=dog&l=cat'],
  [{ value: { b: true, e: 'dog', l: 'cat' } }, '?&b=true&e=dog&l=cat'],
  [{ value: { e: 'dog', l: 'cat' } }, '?e=dog&l=cat'],
  [{ value: { l: 'cat' } }, '?l=cat'],
]

const explodeRequiredObjectOk: QuerySuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, '?s=str&n=10&b=true&e=dog&l=cat'],
]

const noExplodeOptionalObjectOk: QuerySuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, '?value=s,str,n,10,b,true,l,cat,e,dog'],
  [{ value: { n: 10, b: true, e: 'dog', l: 'cat' } }, '?value=n,10,b,true,l,cat,e,dog'],
  [{ value: { b: true, e: 'dog', l: 'cat' } }, '?value=b,true,l,cat,e,dog'],
  [{ value: { e: 'dog', l: 'cat' } }, '?value=l,cat,e,dog'],
]

const noExplodeRequiredObjectOk: QuerySuccessData<OptObjectFieldObj>[] = [
  [{ value: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, '?value=s,str,n,10,b,true,l,cat,e,dog'],
]

const requiredError: QueryErrorData[] = [[''], ['?unrelated=hello']]

const numberError: QueryErrorData[] = [['?value=cat'], ['?value=false'], ['?value=c11']]

const booleanError: QueryErrorData[] = [['?value=cat'], ['?value=12432'], ['?value=cfalse'], ['?value=FaLsE']]

const literalError: QueryErrorData[] = [['?value=dog'], ['?value=12432'], ['?value=cfalse'], ['?value=FaLsE']]

const enumError: QueryErrorData[] = [['?value=_cat'], ['?value=1'], ['?value=CaT'], ['?value=DOG'], ['?value=true']]

const explodeNumberArrayError: QueryErrorData[] = [['?value=1&value=cat'], ['?value=false&value=32'], ['?value=c11']]

const expodeBooleanArrayError: QueryErrorData[] = [
  ['?value=cat&value=true'],
  ['?value=false&value=12432'],
  ['?value=FaLsE'],
]

const explodeLiteralArrayError: QueryErrorData[] = [['?value=dog&value=asd'], ['?value=false&value=cat']]

const explodeEnumArrayError: QueryErrorData[] = [
  ['?value=_cat&value=dog'],
  ['?value=cat&value=1'],
  ['?value=CaT'],
  ['?value=DOG'],
]

const explodeRequiredObjectError: QueryErrorData[] = [
  ['?s=x&n=x&b=x&e=x&l=x'],
  ['?n=10&b=true&e=dog&l=cat'],
  ['?&b=true&e=dog&l=cat'],
  ['?e=dog&l=cat'],
  ['?l=cat'],
]

const explodeOptionalObjectError: QueryErrorData[] = [['?s=x&n=x&b=x&e=x&l=x']]

const explodeRequired: TypesObject<QueryTestData<any>> = {
  primitive: {
    string: { data: stringOk, error: [...requiredError] },
    number: { data: numberOk, error: [...requiredError, ...numberError] },
    boolean: { data: booleanOk, error: [...requiredError, ...booleanError] },
    literal: { data: literalOk, error: [...requiredError, ...literalError] },
    enumeration: { data: enumOk, error: [...requiredError, ...enumError] },
  },
  array: {
    string: { data: explodeStringArrayOk, error: [] },
    number: { data: explodeNumberArrayOk, error: explodeNumberArrayError },
    boolean: { data: explodeBooleanArrayOk, error: expodeBooleanArrayError },
    literal: { data: explodeLiteralArrayOk, error: explodeLiteralArrayError },
    enumeration: { data: explodeEnumArrayOk, error: explodeEnumArrayError },
  },
  object: {
    optionalFields: {
      data: [...explodeOptionalObjectOk, [{ value: {} }, '']],
      error: explodeOptionalObjectError,
    },
    requiredFields: {
      data: explodeRequiredObjectOk,
      error: explodeRequiredObjectError,
    },
  },
}
const explodeOptional: TypesObject<QueryTestData<any>> = {
  primitive: {
    string: { data: [...optionalOk, ...stringOk], error: [] },
    number: { data: [...optionalOk, ...numberOk], error: numberError },
    boolean: { data: [...optionalOk, ...booleanOk], error: booleanError },
    literal: { data: [...optionalOk, ...literalOk], error: literalError },
    enumeration: { data: [...optionalOk, ...enumOk], error: enumError },
  },
  array: {
    string: { data: explodeStringArrayOk, error: [] },
    number: { data: explodeNumberArrayOk, error: explodeNumberArrayError },
    boolean: { data: explodeBooleanArrayOk, error: expodeBooleanArrayError },
    literal: { data: explodeLiteralArrayOk, error: explodeLiteralArrayError },
    enumeration: { data: explodeEnumArrayOk, error: explodeEnumArrayError },
  },
  object: {
    optionalFields: {
      data: [...explodeOptionalObjectOk, [{ value: undefined }, '']],
      error: explodeOptionalObjectError,
    },
    requiredFields: {
      data: explodeRequiredObjectOk,
      error: explodeRequiredObjectError,
    },
  },
}

const noExplodeRequired: TypesObject<QueryTestData<any>> = {
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

const noExplodeOptional: TypesObject<QueryTestData<any>> = {
  primitive: {
    string: { data: [...optionalOk, ...stringOk], error: [] },
    number: { data: [...optionalOk, ...numberOk], error: numberError },
    boolean: { data: [...optionalOk, ...booleanOk], error: booleanError },
    literal: { data: [...optionalOk, ...literalOk], error: literalError },
    enumeration: { data: [...optionalOk, ...enumOk], error: enumError },
  },
  array: {
    string: { data: noExplodeStringArrayOk, error: [] },
    number: { data: noExplodeNumberArrayOk, error: [] },
    boolean: { data: noExplodeBooleanArrayOk, error: [] },
    literal: { data: noExplodeLiteralArrayOk, error: [] },
    enumeration: { data: noExplodeEnumArrayOk, error: [] },
  },
  object: {
    optionalFields: { data: [...noExplodeOptionalObjectOk, [{ value: undefined }, '']], error: [] },
    requiredFields: { data: noExplodeRequiredObjectOk, error: [] },
  },
}

export const formTestData: TestDataObject<QueryTestData<any>> = {
  explode: {
    required: explodeRequired,
    optional: explodeOptional,
  },
  noExplode: {
    required: noExplodeRequired,
    optional: noExplodeOptional,
  },
}
