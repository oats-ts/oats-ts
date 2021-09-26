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
  EnumType,
  LiteralType,
} from '../value/value.testdata'

type ObjType = {
  s: string
  n: number
  b: boolean
  l: LiteralType
  e: EnumType
}
type OptObjType = {
  s?: string
  n?: number
  b?: boolean
  l?: LiteralType
  e?: EnumType
}
type StringFieldObj = { foo: string }
type NumberFieldObj = { foo: number }
type BooleanFieldObj = { foo: boolean }
type LiteralFieldObj = { foo: LiteralType }
type EnumFieldObj = { foo: EnumType }
type ObjectFieldObj = {
  foo: ObjType
}
type OptObjectFieldObj = {
  foo: OptObjType
}

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

const stringFieldObjParser: QueryDeserializers<StringFieldObj> = {
  foo: query.form.primitive(stringParser, { required: true }),
}
const numberFieldObjParser: QueryDeserializers<NumberFieldObj> = {
  foo: query.form.primitive(numberParser, { required: true }),
}
const booleanFieldObjParser: QueryDeserializers<BooleanFieldObj> = {
  foo: query.form.primitive(booleanParser, { required: true }),
}
const literalFieldObjParser: QueryDeserializers<LiteralFieldObj> = {
  foo: query.form.primitive(literalParser, { required: true }),
}
const enumFieldObjParser: QueryDeserializers<EnumFieldObj> = {
  foo: query.form.primitive(enumParser, { required: true }),
}
const objectFieldObjParser: QueryDeserializers<ObjectFieldObj> = {
  foo: query.form.object(objParser, { required: true }),
}
const optObjFieldObjParser: QueryDeserializers<OptObjectFieldObj> = {
  foo: query.form.object(optObjParser, { required: true }),
}

export const queryFormStringData: QueryTestData<StringFieldObj> = {
  data: [
    [{ foo: 'hello' }, '?foo=hello', stringFieldObjParser],
    [{ foo: 'hello test' }, '?foo=hello%20test', stringFieldObjParser],
  ],
  error: [['', stringFieldObjParser]],
}

export const queryFormNumberData: QueryTestData<NumberFieldObj> = {
  data: [
    [{ foo: 10 }, '?foo=10', numberFieldObjParser],
    [{ foo: 10.27 }, '?foo=10.27', numberFieldObjParser],
  ],
  error: [['?foo=cat', numberFieldObjParser]],
}

export const queryFormBooleanData: QueryTestData<BooleanFieldObj> = {
  data: [
    [{ foo: false }, '?foo=false', booleanFieldObjParser],
    [{ foo: true }, '?foo=true', booleanFieldObjParser],
  ],
  error: [['?foo=cat', booleanFieldObjParser]],
}

export const queryFormLiteralData: QueryTestData<LiteralFieldObj> = {
  data: [[{ foo: 'cat' }, '?foo=cat', literalFieldObjParser]],
  error: [['?foo=dog', literalFieldObjParser]],
}

export const queryFormEnumData: QueryTestData<EnumFieldObj> = {
  data: [
    [{ foo: 'cat' }, '?foo=cat', enumFieldObjParser],
    [{ foo: 'dog' }, '?foo=dog', enumFieldObjParser],
    [{ foo: 'racoon' }, '?foo=racoon', enumFieldObjParser],
  ],
  error: [
    ['?foo=catdog', enumFieldObjParser],
    ['?foo=1', enumFieldObjParser],
  ],
}

export const queryFormObjectData: QueryTestData<ObjectFieldObj> = {
  data: [
    [{ foo: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, '?s=str&n=10&b=true&e=dog&l=cat', objectFieldObjParser],
  ],
  error: [
    ['?foo=dog', objectFieldObjParser],
    ['?s=x&n=x&b=x&e=x&l=x', objectFieldObjParser],
    ['?n=10&b=true&e=dog&l=cat', objectFieldObjParser],
    ['?&b=true&e=dog&l=cat', objectFieldObjParser],
    ['?e=dog&l=cat', objectFieldObjParser],
    ['?l=cat', objectFieldObjParser],
  ],
}

export const queryFormOptionalObjectData: QueryTestData<OptObjectFieldObj> = {
  data: [
    [{ foo: { s: 'str', n: 10, b: true, e: 'dog', l: 'cat' } }, '?s=str&n=10&b=true&e=dog&l=cat', optObjFieldObjParser],
    [{ foo: { n: 10, b: true, e: 'dog', l: 'cat' } }, '?n=10&b=true&e=dog&l=cat', optObjFieldObjParser],
    [{ foo: { b: true, e: 'dog', l: 'cat' } }, '?&b=true&e=dog&l=cat', optObjFieldObjParser],
    [{ foo: { e: 'dog', l: 'cat' } }, '?e=dog&l=cat', optObjFieldObjParser],
    [{ foo: { l: 'cat' } }, '?l=cat', optObjFieldObjParser],
    [{ foo: {} }, '', optObjFieldObjParser],
  ],
  error: [['?s=x&n=x&b=x&e=x&l=x', optObjFieldObjParser]],
}
