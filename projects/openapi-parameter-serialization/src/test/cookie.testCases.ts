import { parameter } from '../parameter'
import { encode } from '../utils'
import {
  BoolField,
  ComplexObjField,
  EnmField,
  LitField,
  NumField,
  OptBoolField,
  OptEnmField,
  OptLitField,
  OptNumField,
  OptStrField,
  StrField,
} from './model'
import {
  boolFieldSchema,
  complexObjFieldSchema,
  enmFieldSchema,
  litFieldSchema,
  numFieldSchema,
  optBoolFieldSchema,
  optEnmFieldSchema,
  optLitFieldSchema,
  optNumFieldSchema,
  optStrFieldSchema,
  strFieldSchema,
} from './schemas'
import { CookieTestCase } from './types'

export const requiredStringQuery: CookieTestCase<StrField> = {
  name: 'required form string cookie',
  descriptor: {
    descriptor: {
      str: parameter.cookie.form.required.primitive(parameter.value.string()),
    },
    schema: strFieldSchema,
  },
  data: [
    { model: { str: '' }, serialized: 'str=' },
    { model: { str: 'string' }, serialized: 'str=string' },
    { model: { str: 'hello test' }, serialized: 'str=hello%20test' },
  ],
  deserializerErrors: [null, undefined, 'foo', 'sr=foo', 'str=string; str=asd'],
  serializerErrors: [null, undefined, {} as any, { 'x-string-fiel': 'string' } as any],
}

export const optionalStringQuery: CookieTestCase<OptStrField> = {
  name: 'optional form string cookie',
  descriptor: {
    descriptor: {
      str: parameter.cookie.form.primitive(parameter.value.string()),
    },
    schema: optStrFieldSchema,
  },
  data: [
    { model: { str: 'string' }, serialized: 'str=string' },
    { model: { str: 'hello test' }, serialized: 'str=hello%20test' },
    { model: {}, serialized: undefined },
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredNumberQuery: CookieTestCase<NumField> = {
  name: 'required form number cookie',
  descriptor: {
    descriptor: {
      num: parameter.cookie.form.required.primitive(parameter.value.number()),
    },
    schema: numFieldSchema,
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

export const optionalNumberQuery: CookieTestCase<OptNumField> = {
  name: 'optional form number cookie',
  descriptor: {
    descriptor: {
      num: parameter.cookie.form.primitive(parameter.value.number()),
    },
    schema: optNumFieldSchema,
  },
  data: [{ model: {}, serialized: undefined }, ...requiredNumberQuery.data],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredBooleanQuery: CookieTestCase<BoolField> = {
  name: 'required form boolean cookie',
  descriptor: {
    descriptor: {
      bool: parameter.cookie.form.required.primitive(parameter.value.boolean()),
    },
    schema: boolFieldSchema,
  },
  data: [
    { model: { bool: true }, serialized: 'bool=true' },
    { model: { bool: false }, serialized: 'bool=false' },
  ],
  deserializerErrors: [undefined, null],
  serializerErrors: [],
}

export const optionalBooleanQuery: CookieTestCase<OptBoolField> = {
  name: 'optional form boolean cookie',
  descriptor: {
    descriptor: {
      bool: parameter.cookie.form.primitive(parameter.value.boolean()),
    },
    schema: optBoolFieldSchema,
  },
  data: [{ model: {}, serialized: undefined }, ...requiredBooleanQuery.data],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredLiteralQuery: CookieTestCase<LitField> = {
  name: 'required form literal cookie',
  descriptor: {
    descriptor: {
      lit: parameter.cookie.form.required.primitive(parameter.value.string()),
    },
    schema: litFieldSchema,
  },
  data: [{ model: { lit: 'cat' }, serialized: 'lit=cat' }],
  deserializerErrors: [undefined, null],
  serializerErrors: [],
}

export const optionalLiteralQuery: CookieTestCase<OptLitField> = {
  name: 'optional form literal cookie',
  descriptor: {
    descriptor: {
      lit: parameter.cookie.form.primitive(parameter.value.string()),
    },
    schema: optLitFieldSchema,
  },
  data: [{ model: {}, serialized: undefined }, ...requiredLiteralQuery.data],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredEnumQuery: CookieTestCase<EnmField> = {
  name: 'required form enum cookie',
  descriptor: {
    descriptor: {
      enm: parameter.cookie.form.required.primitive(parameter.value.string()),
    },
    schema: enmFieldSchema,
  },
  data: [
    { model: { enm: 'cat' }, serialized: 'enm=cat' },
    { model: { enm: 'dog' }, serialized: 'enm=dog' },
    { model: { enm: 'racoon' }, serialized: 'enm=racoon' },
  ],
  deserializerErrors: [undefined, null],
  serializerErrors: [],
}

export const optionalEnumQuery: CookieTestCase<OptEnmField> = {
  name: 'optional form enum cookie',
  descriptor: {
    descriptor: {
      enm: parameter.cookie.form.primitive(parameter.value.string()),
    },
    schema: optEnmFieldSchema,
  },
  data: [{ model: {}, serialized: undefined }, ...requiredEnumQuery.data],
  deserializerErrors: [],
  serializerErrors: [],
}

export const jsonComplexObjectCookie: CookieTestCase<ComplexObjField> = {
  name: 'required complex cookie object',
  descriptor: {
    descriptor: {
      obj: parameter.cookie.required.schema('application/json'),
    },
    schema: complexObjFieldSchema,
  },
  data: [
    {
      model: { obj: { req: { s: 'A B C', b: false, n: 123.123, e: 'dog', l: 'cat' }, opt: { b: false, n: 123.123 } } },
      serialized: `obj=${encode(
        JSON.stringify({
          req: { s: 'A B C', b: false, n: 123.123, e: 'dog', l: 'cat' },
          opt: { b: false, n: 123.123 },
        }),
      )}`,
    },
  ],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined, { obj: {} as any }],
}
