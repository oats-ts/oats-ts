import { query } from './index'
import { FieldParsers, QueryDeserializers } from '../types'
import { QueryTestData } from './query.testutils'
import {
  enumParser,
  stringParser,
  numberParser,
  booleanParser,
  literalParser,
  optionalBooleanParser,
  optionalEnumParser,
  optionalLiteralParser,
  optionalNumberParser,
  optionalStringParser,
} from '../value/value.testdata'
import {
  BooleanFieldObj,
  EnumArrayFieldObj,
  EnumFieldObj,
  LiteralFieldObj,
  NumberArrayFieldObj,
  NumberFieldObj,
  ObjectFieldObj,
  ObjType,
  OptObjectFieldObj,
  OptObjType,
  StringFieldObj,
} from '../testTypes'

const objParser: FieldParsers<ObjType> = {
  s: stringParser,
  n: numberParser,
  b: booleanParser,
  l: literalParser,
  e: enumParser,
}

const optObjParser: FieldParsers<OptObjType> = {
  s: optionalStringParser,
  n: optionalNumberParser,
  b: optionalBooleanParser,
  l: optionalLiteralParser,
  e: optionalEnumParser,
}

export const queryFormStringParser: QueryDeserializers<StringFieldObj> = {
  foo: query.form.primitive(stringParser, { required: true }),
}
export const queryFormNumberParser: QueryDeserializers<NumberFieldObj> = {
  foo: query.form.primitive(numberParser, { required: true }),
}
export const queryFormBooleanParser: QueryDeserializers<BooleanFieldObj> = {
  foo: query.form.primitive(booleanParser, { required: true }),
}
export const queryFormLiteralParser: QueryDeserializers<LiteralFieldObj> = {
  foo: query.form.primitive(literalParser, { required: true }),
}
export const queryFormEnumParser: QueryDeserializers<EnumFieldObj> = {
  foo: query.form.primitive(enumParser, { required: true }),
}
export const queryFormObjectExplodeParser: QueryDeserializers<ObjectFieldObj> = {
  foo: query.form.object(objParser, { required: true }),
}
export const queryFormOptionalObjectExplodeParser: QueryDeserializers<OptObjectFieldObj> = {
  foo: query.form.object(optObjParser, { required: true }),
}
export const queryFormNumberArrayExplodeParser: QueryDeserializers<NumberArrayFieldObj> = {
  foo: query.form.array(numberParser, { required: true }),
}
export const queryFormEnumArrayExplodeParser: QueryDeserializers<EnumArrayFieldObj> = {
  foo: query.form.array(enumParser, { required: true }),
}

export const queryFormStringData: QueryTestData<StringFieldObj> = {
  data: [
    [{ foo: 'hello' }, '?foo=hello'],
    [{ foo: 'hello test' }, '?foo=hello%20test'],
  ],
  error: [['']],
}

export const queryFormNumberData: QueryTestData<NumberFieldObj> = {
  data: [
    [{ foo: 10 }, '?foo=10'],
    [{ foo: 10.27 }, '?foo=10.27'],
  ],
  error: [['?foo=cat']],
}

export const queryFormBooleanData: QueryTestData<BooleanFieldObj> = {
  data: [
    [{ foo: false }, '?foo=false'],
    [{ foo: true }, '?foo=true'],
  ],
  error: [['?foo=cat']],
}

export const queryFormLiteralData: QueryTestData<LiteralFieldObj> = {
  data: [[{ foo: 'cat' }, '?foo=cat']],
  error: [['?foo=dog']],
}

export const queryFormEnumData: QueryTestData<EnumFieldObj> = {
  data: [
    [{ foo: 'cat' }, '?foo=cat'],
    [{ foo: 'dog' }, '?foo=dog'],
    [{ foo: 'racoon' }, '?foo=racoon'],
  ],
  error: [['?foo=catdog'], ['?foo=1']],
}

export const queryFormObjectData: QueryTestData<ObjectFieldObj> = {
  data: [[{ foo: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, '?s=str&n=10&b=true&e=dog&l=cat']],
  error: [
    ['?foo=dog'],
    ['?s=x&n=x&b=x&e=x&l=x'],
    ['?n=10&b=true&e=dog&l=cat'],
    ['?&b=true&e=dog&l=cat'],
    ['?e=dog&l=cat'],
    ['?l=cat'],
  ],
}

export const queryFormOptionalObjectData: QueryTestData<OptObjectFieldObj> = {
  data: [
    [{ foo: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, '?s=str&n=10&b=true&e=dog&l=cat'],
    [{ foo: { n: 10, b: true, e: 'dog', l: 'cat' } }, '?n=10&b=true&e=dog&l=cat'],
    [{ foo: { b: true, e: 'dog', l: 'cat' } }, '?&b=true&e=dog&l=cat'],
    [{ foo: { e: 'dog', l: 'cat' } }, '?e=dog&l=cat'],
    [{ foo: { l: 'cat' } }, '?l=cat'],
    [{ foo: {} }, ''],
  ],
  error: [['?s=x&n=x&b=x&e=x&l=x']],
}

export const queryNumberArrayFieldObjectData: QueryTestData<NumberArrayFieldObj> = {
  data: [
    [{ foo: [1, 2, 3] }, '?foo=1&foo=2&foo=3'],
    [{ foo: [1.2, 3.4, 5.998] }, '?foo=1.2&foo=3.4&foo=5.998'],
    [{ foo: [] }, ''],
  ],
  error: [['?foo=cat']],
}

export const queryEnumArrayFieldObjectData: QueryTestData<EnumArrayFieldObj> = {
  data: [
    [{ foo: ['cat', 'dog', 'racoon'] }, '?foo=cat&foo=dog&foo=racoon'],
    [{ foo: ['cat'] }, '?foo=cat'],
    [{ foo: [] }, ''],
  ],
  error: [['?foo=1']],
}
