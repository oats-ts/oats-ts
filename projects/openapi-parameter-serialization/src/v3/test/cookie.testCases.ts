import { parameter } from '../parameter'
import { enm, lit } from './common'
import { EnumType, LiteralType } from './model'
import { CookieTestCase } from './types'

export const requiredStringQuery: CookieTestCase<{ str: string }> = {
  name: 'required form string cookie',

  dsl: {
    schema: {
      str: parameter.cookie.form.required.primitive(parameter.value.string()),
    },
  },
  data: [
    { model: { str: '' }, serialized: 'str=' },
    { model: { str: 'string' }, serialized: 'str=string' },
    { model: { str: 'hello test' }, serialized: 'str=hello%20test' },
  ],
  deserializerErrors: [null, undefined, 'foo', 'sr=foo', 'str=string; str=asd'],
  serializerErrors: [null, undefined, {} as any, { 'x-string-fiel': 'string' } as any],
}

export const optionalStringQuery: CookieTestCase<{ str?: string }> = {
  name: 'optional form string cookie',
  dsl: {
    schema: {
      str: parameter.cookie.form.primitive(parameter.value.string()),
    },
  },
  data: [
    { model: { str: 'string' }, serialized: 'str=string' },
    { model: { str: 'hello test' }, serialized: 'str=hello%20test' },
    { model: {}, serialized: undefined },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredNumberQuery: CookieTestCase<{ num: number }> = {
  name: 'required form number cookie',
  dsl: {
    schema: {
      num: parameter.cookie.form.required.primitive(parameter.value.number()),
    },
  },
  data: [
    { model: { num: 12 }, serialized: 'num=12' },
    { model: { num: 56.789 }, serialized: 'num=56%2E789' },
    { model: { num: -123 }, serialized: 'num=-123' },
    { model: { num: 0 }, serialized: 'num=0' },
  ],
  deserializerErrors: [undefined, null],
  serializerErrors: [],
}

export const optionalNumberQuery: CookieTestCase<{ num?: number }> = {
  name: 'optional form number cookie',
  dsl: {
    schema: {
      num: parameter.cookie.form.primitive(parameter.value.number()),
    },
  },
  data: [{ model: {}, serialized: undefined }, ...requiredNumberQuery.data],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredBooleanQuery: CookieTestCase<{ bool: boolean }> = {
  name: 'required form boolean cookie',
  dsl: {
    schema: {
      bool: parameter.cookie.form.required.primitive(parameter.value.boolean()),
    },
  },
  data: [
    { model: { bool: true }, serialized: 'bool=true' },
    { model: { bool: false }, serialized: 'bool=false' },
  ],
  deserializerErrors: [undefined, null],
  serializerErrors: [],
}

export const optionalBooleanQuery: CookieTestCase<{ bool?: boolean }> = {
  name: 'optional form boolean cookie',
  dsl: {
    schema: {
      bool: parameter.cookie.form.primitive(parameter.value.boolean()),
    },
  },
  data: [{ model: {}, serialized: undefined }, ...requiredBooleanQuery.data],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredLiteralQuery: CookieTestCase<{ lit: LiteralType }> = {
  name: 'required form literal cookie',
  dsl: {
    schema: {
      lit: parameter.cookie.form.required.primitive(lit),
    },
  },
  data: [{ model: { lit: 'cat' }, serialized: 'lit=cat' }],
  deserializerErrors: [undefined, null],
  serializerErrors: [],
}

export const optionalLiteralQuery: CookieTestCase<{ lit?: LiteralType }> = {
  name: 'optional form literal cookie',
  dsl: {
    schema: {
      lit: parameter.cookie.form.primitive(lit),
    },
  },
  data: [{ model: {}, serialized: undefined }, ...requiredLiteralQuery.data],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredEnumQuery: CookieTestCase<{ enm: EnumType }> = {
  name: 'required form enum cookie',
  dsl: {
    schema: {
      enm: parameter.cookie.form.required.primitive(enm),
    },
  },
  data: [
    { model: { enm: 'cat' }, serialized: 'enm=cat' },
    { model: { enm: 'dog' }, serialized: 'enm=dog' },
    { model: { enm: 'racoon' }, serialized: 'enm=racoon' },
  ],
  deserializerErrors: [undefined, null],
  serializerErrors: [],
}

export const optionalEnumQuery: CookieTestCase<{ enm?: EnumType }> = {
  name: 'optional form enum cookie',
  dsl: {
    schema: {
      enm: parameter.cookie.form.primitive(enm),
    },
  },
  data: [{ model: {}, serialized: undefined }, ...requiredEnumQuery.data],
  deserializerErrors: [],
  serializerErrors: [],
}
