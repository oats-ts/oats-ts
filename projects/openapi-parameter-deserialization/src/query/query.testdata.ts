import { query } from '.'
import { ObjectDeserializer, QueryDeserializers } from '..'
import { TestData } from './query.testutils'

type LiteralType = 'cat'
type EnumType = 'cat' | 'dog' | 'racoon'
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

const stringParser = query.string(query.identity)
const numberParser = query.number(query.identity)
const booleanParser = query.boolean(query.identity)
const literalParser = query.string(query.literal<string, LiteralType>('cat'))
const enumParser = query.string(query.enumeration<string, EnumType>(['cat', 'dog', 'racoon']))

const objParser: ObjectDeserializer<ObjType> = {
  s: stringParser,
  n: numberParser,
  b: booleanParser,
  l: literalParser,
  e: enumParser,
}

const optObjParser: ObjectDeserializer<OptObjType> = {
  s: query.optional(stringParser),
  n: query.optional(numberParser),
  b: query.optional(booleanParser),
  l: query.optional(literalParser),
  e: query.optional(enumParser),
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

export const queryFormStringData: TestData<StringFieldObj> = {
  data: [
    [{ foo: 'hello' }, '?foo=hello', stringFieldObjParser],
    [{ foo: 'hello test' }, '?foo=hello%20test', stringFieldObjParser],
  ],
  error: [['', stringFieldObjParser]],
}

export const queryFormNumberData: TestData<NumberFieldObj> = {
  data: [
    [{ foo: 10 }, '?foo=10', numberFieldObjParser],
    [{ foo: 10.27 }, '?foo=10.27', numberFieldObjParser],
  ],
  error: [['?foo=cat', numberFieldObjParser]],
}

export const queryFormBooleanData: TestData<BooleanFieldObj> = {
  data: [
    [{ foo: false }, '?foo=false', booleanFieldObjParser],
    [{ foo: true }, '?foo=true', booleanFieldObjParser],
  ],
  error: [['?foo=cat', booleanFieldObjParser]],
}

export const queryFormLiteralData: TestData<LiteralFieldObj> = {
  data: [[{ foo: 'cat' }, '?foo=cat', literalFieldObjParser]],
  error: [['?foo=dog', literalFieldObjParser]],
}

export const queryFormEnumData: TestData<EnumFieldObj> = {
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

export const queryFormObjectData: TestData<ObjectFieldObj> = {
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

export const queryFormOptionalObjectData: TestData<OptObjectFieldObj> = {
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
