import { dsl } from '../dsl'
import { enm, lit, obj, optObj } from './common'
import { EnumType, LiteralType, ObjType, OptObjType } from './model'
import { QueryTestCase } from './types'

export const requiredStringQuery: QueryTestCase<{ str: string }> = {
  name: 'required form string query',
  dsl: {
    schema: {
      str: dsl.query.form.primitive(dsl.value.string(), { required: true }),
    },
  },
  data: [
    { model: { str: '' }, serialized: '?str=' },
    { model: { str: 'string' }, serialized: '?str=string' },
    { model: { str: 'hello test' }, serialized: '?str=hello%20test' },
  ],
  deserializerErrors: [null, undefined, 'foo', 'sr=foo'],
  serializerErrors: [null, undefined, {} as any, { 'x-string-fiel': 'string' } as any],
}

export const optionalStringQuery: QueryTestCase<{ str?: string }> = {
  name: 'optional form string query',
  dsl: {
    schema: {
      str: dsl.query.form.primitive(dsl.value.string(), { required: false }),
    },
  },
  data: [
    { model: { str: 'string' }, serialized: '?str=string' },
    { model: { str: 'hello test' }, serialized: '?str=hello%20test' },
    { model: {}, serialized: undefined },
  ],
  deserializerErrors: ['?str=string&str=foo'],
  serializerErrors: [],
}

export const requiredNumberQuery: QueryTestCase<{ num: number }> = {
  name: 'required form number query',
  dsl: {
    schema: {
      num: dsl.query.form.primitive(dsl.value.number(), { required: true }),
    },
  },
  data: [
    { model: { num: 12 }, serialized: '?num=12' },
    { model: { num: 56.789 }, serialized: '?num=56%2E789' },
    { model: { num: -123 }, serialized: '?num=-123' },
    { model: { num: 0 }, serialized: '?num=0' },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const optionalNumberQuery: QueryTestCase<{ num?: number }> = {
  name: 'optional form number query',
  dsl: {
    schema: {
      num: dsl.query.form.primitive(dsl.value.number(), { required: false }),
    },
  },
  data: [{ model: {}, serialized: undefined }, ...requiredNumberQuery.data],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredBooleanQuery: QueryTestCase<{ bool: boolean }> = {
  name: 'required form boolean query',
  dsl: {
    schema: {
      bool: dsl.query.form.primitive(dsl.value.boolean(), { required: true }),
    },
  },
  data: [
    { model: { bool: true }, serialized: '?bool=true' },
    { model: { bool: false }, serialized: '?bool=false' },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const optionalBooleanQuery: QueryTestCase<{ bool?: boolean }> = {
  name: 'optional form boolean query',
  dsl: {
    schema: {
      bool: dsl.query.form.primitive(dsl.value.boolean(), { required: false }),
    },
  },
  data: [{ model: {}, serialized: undefined }, ...requiredBooleanQuery.data],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredLiteralQuery: QueryTestCase<{ lit: LiteralType }> = {
  name: 'required form literal query',
  dsl: {
    schema: {
      lit: dsl.query.form.primitive(lit, { required: true }),
    },
  },
  data: [{ model: { lit: 'cat' }, serialized: '?lit=cat' }],
  deserializerErrors: [],
  serializerErrors: [],
}

export const optionalLiteralQuery: QueryTestCase<{ lit?: LiteralType }> = {
  name: 'optional form literal query',
  dsl: {
    schema: {
      lit: dsl.query.form.primitive(lit, { required: false }),
    },
  },
  data: [{ model: {}, serialized: undefined }, ...requiredLiteralQuery.data],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredEnumQuery: QueryTestCase<{ enm: EnumType }> = {
  name: 'required form enum query',
  dsl: {
    schema: {
      enm: dsl.query.form.primitive(enm, { required: true }),
    },
  },
  data: [
    { model: { enm: 'cat' }, serialized: '?enm=cat' },
    { model: { enm: 'dog' }, serialized: '?enm=dog' },
    { model: { enm: 'racoon' }, serialized: '?enm=racoon' },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const optionalEnumQuery: QueryTestCase<{ enm?: EnumType }> = {
  name: 'optional form enum query',
  dsl: {
    schema: {
      enm: dsl.query.form.primitive(enm, { required: false }),
    },
  },
  data: [{ model: {}, serialized: undefined }, ...requiredEnumQuery.data],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredFormNumberArrayQuery: QueryTestCase<{ arr: number[] }> = {
  name: 'required form number[] query',
  dsl: {
    schema: {
      arr: dsl.query.form.array(dsl.value.number(), { required: true }),
    },
  },
  data: [
    { model: { arr: [1, 2, 3] }, serialized: '?arr=1&arr=2&arr=3' },
    { model: { arr: [1.3, 1.543, 0.123] }, serialized: '?arr=1%2E3&arr=1%2E543&arr=0%2E123' },
    // TODO is this ok? Do we need allowEmptyValue?
    // { from: { arr: [] }, to: undefined },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const optionalFormNumberArrayQuery: QueryTestCase<{ arr?: number[] }> = {
  name: 'optional form number[] query',
  dsl: {
    schema: {
      arr: dsl.query.form.array(dsl.value.number(), { required: false }),
    },
  },
  data: [{ model: { arr: undefined }, serialized: undefined }, ...requiredFormNumberArrayQuery.data],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredFormNumberArrayNoExplodeQuery: QueryTestCase<{ arr: number[] }> = {
  name: 'required non-exploded form number[] query',
  dsl: {
    schema: {
      arr: dsl.query.form.array(dsl.value.number(), { required: true, explode: false }),
    },
  },
  data: [
    { model: { arr: [1, 2, 3] }, serialized: '?arr=1,2,3' },
    { model: { arr: [1.3, 1.543, 0.123] }, serialized: '?arr=1%2E3,1%2E543,0%2E123' },
    // TODO is this ok? Do we need allowEmptyValue?
    // { from: { arr: [] }, to: undefined },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredPipeDelimitedStringArrayQuery: QueryTestCase<{ arr: string[] }> = {
  name: 'required pipe-delimited string[] query',
  dsl: {
    schema: {
      arr: dsl.query.pipeDelimited.array(dsl.value.string(), { required: true }),
    },
  },
  data: [
    { model: { arr: ['foo', 'ab? ./'] }, serialized: '?arr=foo&arr=ab%3F%20%2E%2F' },
    { model: { arr: [] }, serialized: undefined },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredPipeDelimitedNonExplodedStringArrayQuery: QueryTestCase<{ arr: string[] }> = {
  name: 'required pipe-delimited non-exploded string[] query',
  dsl: {
    schema: {
      arr: dsl.query.pipeDelimited.array(dsl.value.string(), { required: true, explode: false }),
    },
  },
  data: [
    { model: { arr: ['foo'] }, serialized: '?arr=foo' },
    { model: { arr: ['foo', 'ab? ./'] }, serialized: '?arr=foo|ab%3F%20%2E%2F' },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredSpaceDelimitedBooleanArrayQuery: QueryTestCase<{ arr: boolean[] }> = {
  name: 'required space-delimited boolean[] query',
  dsl: {
    schema: {
      arr: dsl.query.spaceDelimited.array(dsl.value.boolean(), { required: true }),
    },
  },
  data: [
    { model: { arr: [] }, serialized: undefined },
    { model: { arr: [false] }, serialized: '?arr=false' },
    { model: { arr: [true, false] }, serialized: '?arr=true&arr=false' },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredSpaceDelimitedNonExplodedStringArrayQuery: QueryTestCase<{ arr: string[] }> = {
  name: 'required space-delimited non-exploded string[] query',
  dsl: {
    schema: {
      arr: dsl.query.spaceDelimited.array(dsl.value.string(), { required: true, explode: false }),
    },
  },
  data: [
    { model: { arr: ['foo'] }, serialized: '?arr=foo' },
    { model: { arr: ['foo', 'bar'] }, serialized: '?arr=foo%20bar' },
    // { from: { arr: ['foo bar', 'bar foo'] }, to: '?arr=foo%20bar' },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredFormObjectQuery: QueryTestCase<{ obj: ObjType }> = {
  name: 'required form object query',
  dsl: {
    schema: {
      obj: dsl.query.form.object(obj, { required: true }),
    },
  },
  data: [
    {
      model: { obj: { b: true, s: 'foo', n: 42, e: 'dog', l: 'cat' } },
      serialized: '?b=true&e=dog&l=cat&n=42&s=foo',
    },
    {
      model: { obj: { b: false, s: 'a . c', n: 45.32, e: 'racoon', l: 'cat' } },
      serialized: '?b=false&e=racoon&l=cat&n=45%2E32&s=a%20%2E%20c',
    },
  ],
  deserializerErrors: [undefined, null, '?b=false&e=racoon&l=cat&n=45%2E32&s=a%20%2E%20c&b=true'],
  serializerErrors: [{ obj: undefined! }],
}

export const requiredNoExplodeFormObjectQuery: QueryTestCase<{ obj: ObjType }> = {
  name: 'required non-exploded form object query',
  dsl: {
    schema: {
      obj: dsl.query.form.object(obj, { required: true, explode: false }),
    },
  },
  data: [
    {
      model: { obj: { b: true, s: 'foo', n: 42, e: 'dog', l: 'cat' } },
      serialized: '?obj=b,true,e,dog,l,cat,n,42,s,foo',
    },
    {
      model: { obj: { b: false, s: 'a . c', n: 45.32, e: 'racoon', l: 'cat' } },
      serialized: '?obj=b,false,e,racoon,l,cat,n,45%2E32,s,a%20%2E%20c',
    },
  ],

  deserializerErrors: [undefined, null, '?obj=b,true,e,dog,l,cat,n,42,s,foo&obj=boo', '?obj=b,true,e'],
  serializerErrors: [{ obj: undefined! }],
}

export const optionalFormObjectQuery: QueryTestCase<{ obj?: ObjType }> = {
  name: 'optional form object query',
  dsl: {
    schema: {
      obj: dsl.query.form.object(obj, { required: false }),
    },
  },
  data: [{ model: { obj: undefined }, serialized: undefined }, ...requiredFormObjectQuery.data],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredPartialFormObjectQuery: QueryTestCase<{ obj: OptObjType }> = {
  name: 'required partial form object query',
  dsl: {
    schema: {
      obj: dsl.query.form.object(optObj, { required: true }),
    },
  },
  data: [
    {
      model: { obj: { b: true, s: 'foo', n: 42, e: 'dog', l: 'cat' } },
      serialized: '?b=true&e=dog&l=cat&n=42&s=foo',
    },
    {
      model: { obj: { s: 'foo', n: 42, e: 'dog', l: 'cat' } },
      serialized: '?e=dog&l=cat&n=42&s=foo',
    },
    {
      model: { obj: { n: 42, e: 'dog', l: 'cat' } },
      serialized: '?e=dog&l=cat&n=42',
    },
    {
      model: { obj: { l: 'cat' } },
      serialized: '?l=cat',
    },
    {
      model: { obj: {} },
      serialized: undefined,
    },
  ],
  deserializerErrors: [],
  serializerErrors: [{ obj: undefined! }],
}

export const requiredDeepObjectQuery: QueryTestCase<{ obj: ObjType }> = {
  name: 'required deepObject object query',
  dsl: {
    schema: {
      obj: dsl.query.deepObject.object(obj, { required: true }),
    },
  },
  data: [
    {
      model: { obj: { b: true, s: 'foo', n: 42, e: 'dog', l: 'cat' } },
      serialized: '?obj[b]=true&obj[s]=foo&obj[n]=42&obj[e]=dog&obj[l]=cat',
    },
    {
      model: { obj: { b: false, s: 'a . c', n: 45.32, e: 'racoon', l: 'cat' } },
      serialized: '?obj[b]=false&obj[s]=a%20%2E%20c&obj[n]=45%2E32&obj[e]=racoon&obj[l]=cat',
    },
  ],
  deserializerErrors: [undefined, null, '?obj[b]=true&obj[s]=foo&obj[n]=42&obj[e]=dog&obj[l]=cat&obj[b]=bar'],
  serializerErrors: [{ obj: undefined! }],
}

export const optionalDeepObjectQuery: QueryTestCase<{ obj?: ObjType }> = {
  name: 'optional deepObject object query',
  dsl: {
    schema: {
      obj: dsl.query.deepObject.object(obj, { required: false }),
    },
  },
  data: [...requiredDeepObjectQuery.data, { model: { obj: undefined }, serialized: undefined }],
  deserializerErrors: [],
  serializerErrors: [],
}
