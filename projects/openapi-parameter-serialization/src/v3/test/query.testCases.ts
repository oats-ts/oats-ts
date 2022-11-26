import { dsl } from '../dsl'
import { obj, optObj } from './common'
import { EnumType, LiteralType, ObjType, OptObjType } from './model'
import { QueryTestCase } from './types'

export const requiredStringQuery: QueryTestCase<{ str: string }> = {
  name: 'required form string query',
  dsl: {
    str: dsl.query.form.primitive(dsl.value.string(), { required: true }),
  },
  serialize: [
    { from: { str: 'string' }, to: '?str=string' },
    { from: { str: 'hello test' }, to: '?str=hello%20test' },
  ],
  deserialize: [
    { from: '?str=string', to: { str: 'string' } },
    { from: '?str=hello%20test', to: { str: 'hello test' } },
  ],
  deserializerErrors: [null, undefined, 'foo', 'sr=foo'],
  serializerErrors: [null, undefined, {} as any, { 'x-string-fiel': 'string' } as any],
}

export const optionalStringQuery: QueryTestCase<{ str?: string }> = {
  name: 'optional form string query',
  dsl: {
    str: dsl.query.form.primitive(dsl.value.string(), { required: false }),
  },
  serialize: [
    { from: { str: 'string' }, to: '?str=string' },
    { from: { str: 'hello test' }, to: '?str=hello%20test' },
    { from: {}, to: undefined },
  ],
  deserialize: [
    { from: '?str=string', to: { str: 'string' } },
    { from: '?str=hello%20test', to: { str: 'hello test' } },
    { from: undefined, to: {} },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredNumberQuery: QueryTestCase<{ num: number }> = {
  name: 'required form number query',
  dsl: {
    num: dsl.query.form.primitive(dsl.value.number(), { required: true }),
  },
  serialize: [
    { from: { num: 12 }, to: '?num=12' },
    { from: { num: 56.789 }, to: '?num=56%2E789' },
    { from: { num: -123 }, to: '?num=-123' },
    { from: { num: 0 }, to: '?num=0' },
  ],
  deserialize: [
    { to: { num: 12 }, from: '?num=12' },
    { to: { num: 56.789 }, from: '?num=56%2E789' },
    { to: { num: -123 }, from: '?num=-123' },
    { to: { num: 0 }, from: '?num=0' },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const optionalNumberQuery: QueryTestCase<{ num?: number }> = {
  name: 'optional form number query',
  dsl: {
    num: dsl.query.form.primitive(dsl.value.number(), { required: false }),
  },
  serialize: [{ from: {}, to: undefined }, ...requiredNumberQuery.serialize],
  deserialize: [{ to: {}, from: undefined }, ...requiredNumberQuery.deserialize],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredBooleanQuery: QueryTestCase<{ bool: boolean }> = {
  name: 'required form boolean query',
  dsl: {
    bool: dsl.query.form.primitive(dsl.value.boolean(), { required: true }),
  },
  serialize: [
    { from: { bool: true }, to: '?bool=true' },
    { from: { bool: false }, to: '?bool=false' },
  ],
  deserialize: [
    { to: { bool: true }, from: '?bool=true' },
    { to: { bool: false }, from: '?bool=false' },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const optionalBooleanQuery: QueryTestCase<{ bool?: boolean }> = {
  name: 'optional form boolean query',
  dsl: {
    bool: dsl.query.form.primitive(dsl.value.boolean(), { required: false }),
  },
  serialize: [{ from: {}, to: undefined }, ...requiredBooleanQuery.serialize],
  deserialize: [{ to: {}, from: undefined }, ...requiredBooleanQuery.deserialize],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredLiteralQuery: QueryTestCase<{ lit: LiteralType }> = {
  name: 'required form literal query',
  dsl: {
    lit: dsl.query.form.primitive(dsl.value.literal('cat'), { required: true }),
  },
  serialize: [{ from: { lit: 'cat' }, to: '?lit=cat' }],
  deserialize: [{ to: { lit: 'cat' }, from: '?lit=cat' }],
  deserializerErrors: [],
  serializerErrors: [],
}

export const optionalLiteralQuery: QueryTestCase<{ lit?: LiteralType }> = {
  name: 'optional form literal query',
  dsl: {
    lit: dsl.query.form.primitive(dsl.value.literal('cat'), { required: false }),
  },
  serialize: [{ from: {}, to: undefined }, ...requiredLiteralQuery.serialize],
  deserialize: [{ from: undefined, to: {} }, ...requiredLiteralQuery.deserialize],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredEnumQuery: QueryTestCase<{ enm: EnumType }> = {
  name: 'required form enum query',
  dsl: {
    enm: dsl.query.form.primitive(dsl.value.enum(['cat', 'dog', 'racoon']), { required: true }),
  },
  serialize: [
    { from: { enm: 'cat' }, to: '?enm=cat' },
    { from: { enm: 'dog' }, to: '?enm=dog' },
    { from: { enm: 'racoon' }, to: '?enm=racoon' },
  ],
  deserialize: [
    { to: { enm: 'cat' }, from: '?enm=cat' },
    { to: { enm: 'dog' }, from: '?enm=dog' },
    { to: { enm: 'racoon' }, from: '?enm=racoon' },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const optionalEnumQuery: QueryTestCase<{ enm?: EnumType }> = {
  name: 'optional form enum query',
  dsl: {
    enm: dsl.query.form.primitive(dsl.value.enum(['cat', 'dog', 'racoon']), { required: false }),
  },
  serialize: [{ from: {}, to: undefined }, ...requiredEnumQuery.serialize],
  deserialize: [{ to: {}, from: undefined }, ...requiredEnumQuery.deserialize],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredFormNumberArrayQuery: QueryTestCase<{ arr: number[] }> = {
  name: 'required form number[] query',
  dsl: {
    arr: dsl.query.form.array(dsl.value.number(), { required: true }),
  },
  serialize: [
    { from: { arr: [1, 2, 3] }, to: '?arr=1&arr=2&arr=3' },
    { from: { arr: [1.3, 1.543, 0.123] }, to: '?arr=1%2E3&arr=1%2E543&arr=0%2E123' },
    // TODO is this ok? Do we need allowEmptyValue?
    // { from: { arr: [] }, to: undefined },
  ],
  deserialize: [
    { to: { arr: [1, 2, 3] }, from: '?arr=1&arr=2&arr=3' },
    { to: { arr: [1.3, 1.543, 0.123] }, from: '?arr=1%2E3&arr=1%2E543&arr=0%2E123' },
    // { to: { arr: [] }, from: undefined },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const optionalFormNumberArrayQuery: QueryTestCase<{ arr?: number[] }> = {
  name: 'optional form number[] query',
  dsl: {
    arr: dsl.query.form.array(dsl.value.number(), { required: false }),
  },
  serialize: [{ from: { arr: undefined }, to: undefined }, ...requiredFormNumberArrayQuery.serialize],
  deserialize: [{ to: { arr: undefined }, from: undefined }, ...requiredFormNumberArrayQuery.deserialize],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredFormNumberArrayNoExplodeQuery: QueryTestCase<{ arr: number[] }> = {
  name: 'required non-exploded form number[] query',
  dsl: {
    arr: dsl.query.form.array(dsl.value.number(), { required: true, explode: false }),
  },
  serialize: [
    { from: { arr: [1, 2, 3] }, to: '?arr=1,2,3' },
    { from: { arr: [1.3, 1.543, 0.123] }, to: '?arr=1%2E3,1%2E543,0%2E123' },
    // TODO is this ok? Do we need allowEmptyValue?
    // { from: { arr: [] }, to: undefined },
  ],
  deserialize: [
    { to: { arr: [1, 2, 3] }, from: '?arr=1,2,3' },
    { to: { arr: [1.3, 1.543, 0.123] }, from: '?arr=1%2E3,1%2E543,0%2E123' },
    // { to: { arr: [] }, from: undefined },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredFormObjectQuery: QueryTestCase<{ obj: ObjType }> = {
  name: 'required form object query',
  dsl: {
    obj: dsl.query.form.object(obj, { required: true }),
  },
  serialize: [
    {
      from: { obj: { b: true, s: 'foo', n: 42, e: 'dog', l: 'cat' } },
      to: '?b=true&e=dog&l=cat&n=42&s=foo',
    },
    {
      from: { obj: { b: false, s: 'a . c', n: 45.32, e: 'racoon', l: 'cat' } },
      to: '?b=false&e=racoon&l=cat&n=45%2E32&s=a%20%2E%20c',
    },
  ],
  deserialize: [
    {
      to: { obj: { b: true, s: 'foo', n: 42, e: 'dog', l: 'cat' } },
      from: '?b=true&s=foo&n=42&e=dog&l=cat',
    },
    {
      to: { obj: { b: false, s: 'a . c', n: 45.32, e: 'racoon', l: 'cat' } },
      from: '?b=false&s=a%20%2E%20c&n=45%2E32&e=racoon&l=cat',
    },
  ],
  deserializerErrors: [undefined, null],
  serializerErrors: [{ obj: undefined! }],
}

export const optionalFormObjectQuery: QueryTestCase<{ obj?: ObjType }> = {
  name: 'required form object query',
  dsl: {
    obj: dsl.query.form.object(obj, { required: false }),
  },
  serialize: [{ from: { obj: undefined }, to: undefined }, ...requiredFormObjectQuery.serialize],
  deserialize: [{ to: { obj: undefined }, from: undefined }, ...requiredFormObjectQuery.deserialize],
  deserializerErrors: [],
  serializerErrors: [],
}

// TODO order!
export const requiredPartialFormObjectQuery: QueryTestCase<{ obj: OptObjType }> = {
  name: 'required partial form object query',
  dsl: {
    obj: dsl.query.form.object(optObj, { required: true }),
  },
  serialize: [
    {
      from: { obj: { b: true, s: 'foo', n: 42, e: 'dog', l: 'cat' } },
      to: '?b=true&e=dog&l=cat&n=42&s=foo',
    },
    {
      from: { obj: { s: 'foo', n: 42, e: 'dog', l: 'cat' } },
      to: '?e=dog&l=cat&n=42&s=foo',
    },
  ],
  deserialize: [],
  deserializerErrors: [],
  serializerErrors: [{ obj: undefined! }],
}
