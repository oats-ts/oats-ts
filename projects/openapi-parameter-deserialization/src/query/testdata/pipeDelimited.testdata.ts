import { QueryErrorData, QuerySuccessData, QueryTestData } from '../query.testutils'
import {
  BooleanArrayFieldObj,
  EnumArrayFieldObj,
  LiteralArrayFieldObj,
  NumberArrayFieldObj,
  StringArrayFieldObj,
  TestDataObject,
  TypesObject,
} from '../../testTypes'

const explodeStringArrayOk: QuerySuccessData<StringArrayFieldObj>[] = [
  [{ value: ['foo', 'bar', 'foobar'] }, '?value=foo&value=bar&value=foobar'],
  [{ value: [] }, ''],
]

const explodeNumberArrayOk: QuerySuccessData<NumberArrayFieldObj>[] = [
  [{ value: [1, 2, 3] }, '?value=1&value=2&value=3'],
  [{ value: [1.2, 3.4, 5.998] }, '?value=1.2&value=3.4&value=5.998'],
  [{ value: [] }, ''],
]

const explodeBooleanArrayOk: QuerySuccessData<BooleanArrayFieldObj>[] = [
  [{ value: [true, false] }, '?value=true&value=false'],
  [{ value: [] }, ''],
]

const explodeLiteralArrayOk: QuerySuccessData<LiteralArrayFieldObj>[] = [
  [{ value: ['cat', 'cat'] }, '?value=cat&value=cat'],
  [{ value: [] }, ''],
]

const explodeEnumArrayOk: QuerySuccessData<EnumArrayFieldObj>[] = [
  [{ value: ['cat', 'dog', 'racoon'] }, '?value=cat&value=dog&value=racoon'],
  [{ value: ['cat'] }, '?value=cat'],
  [{ value: [] }, ''],
]

const noExplodeStringArrayOk: QuerySuccessData<StringArrayFieldObj>[] = [
  [{ value: ['foo', 'bar', 'foobar'] }, '?value=foo|bar|foobar'],
]

const noExplodeNumberArrayOk: QuerySuccessData<NumberArrayFieldObj>[] = [
  [{ value: [1, 2, 3] }, '?value=1|2|3'],
  [{ value: [1.2, 3.4, 5.998] }, '?value=1.2|3.4|5.998'],
]

const noExplodeBooleanArrayOk: QuerySuccessData<BooleanArrayFieldObj>[] = [
  [{ value: [true, false] }, '?value=true|false'],
]

const noExplodeLiteralArrayOk: QuerySuccessData<LiteralArrayFieldObj>[] = [
  [{ value: ['cat', 'cat'] }, '?value=cat|cat'],
]

const noExplodeEnumArrayOk: QuerySuccessData<EnumArrayFieldObj>[] = [
  [{ value: ['cat', 'dog', 'racoon'] }, '?value=cat|dog|racoon'],
  [{ value: ['cat'] }, '?value=cat'],
]

const noExplodeNumberArrayError: QueryErrorData[] = [['?value=1|cat'], ['?value=false|32'], ['?value=c11']]

const explodeNumberArrayError: QueryErrorData[] = [['?value=1|cat'], ['?value=false|32'], ['?value=c11']]

const expodeBooleanArrayError: QueryErrorData[] = [['?value=cat|true'], ['?value=fals|12432'], ['?value=FaLsE']]

const explodeLiteralArrayError: QueryErrorData[] = [['?value=dog|asd'], ['?value=false|cat']]

const explodeEnumArrayError: QueryErrorData[] = [['?value=_cat|dog'], ['?value=cat|1'], ['?value=CaT'], ['?value=DOG']]

const noExpodeBooleanArrayError: QueryErrorData[] = [['?value=cat|true'], ['?value=false|12432'], ['?value=FaLsE']]

const noExplodeLiteralArrayError: QueryErrorData[] = [['?value=dog&value=asd'], ['?value=false&value=cat']]

const noExplodeEnumArrayError: QueryErrorData[] = [
  ['?value=_cat|dog'],
  ['?value=cat|1'],
  ['?value=CaT&value=asd'],
  ['?value=DOG'],
]

const explodeRequired: TypesObject<QueryTestData<any>> = {
  array: {
    string: { data: explodeStringArrayOk, error: [] },
    number: { data: explodeNumberArrayOk, error: explodeNumberArrayError },
    boolean: { data: explodeBooleanArrayOk, error: expodeBooleanArrayError },
    literal: { data: explodeLiteralArrayOk, error: explodeLiteralArrayError },
    enumeration: { data: explodeEnumArrayOk, error: explodeEnumArrayError },
  },
}

const explodeOptional: TypesObject<QueryTestData<any>> = {
  array: {
    string: { data: explodeStringArrayOk, error: [] },
    number: { data: explodeNumberArrayOk, error: explodeNumberArrayError },
    boolean: { data: explodeBooleanArrayOk, error: expodeBooleanArrayError },
    literal: { data: explodeLiteralArrayOk, error: explodeLiteralArrayError },
    enumeration: { data: explodeEnumArrayOk, error: explodeEnumArrayError },
  },
}

const noExplodeRequired: TypesObject<QueryTestData<any>> = {
  array: {
    string: { data: noExplodeStringArrayOk, error: [] },
    number: { data: noExplodeNumberArrayOk, error: noExplodeNumberArrayError },
    boolean: { data: noExplodeBooleanArrayOk, error: noExpodeBooleanArrayError },
    literal: { data: noExplodeLiteralArrayOk, error: noExplodeLiteralArrayError },
    enumeration: { data: noExplodeEnumArrayOk, error: noExplodeEnumArrayError },
  },
}

const noExplodeOptional: TypesObject<QueryTestData<any>> = {
  array: {
    string: { data: noExplodeStringArrayOk, error: [] },
    number: { data: noExplodeNumberArrayOk, error: [] },
    boolean: { data: noExplodeBooleanArrayOk, error: [] },
    literal: { data: noExplodeLiteralArrayOk, error: [] },
    enumeration: { data: noExplodeEnumArrayOk, error: [] },
  },
}

export const pipeDelimitedTestData: TestDataObject<QueryTestData<any>> = {
  explode: {
    required: explodeRequired,
    optional: explodeOptional,
  },
  noExplode: {
    required: noExplodeRequired,
    optional: noExplodeOptional,
  },
}
