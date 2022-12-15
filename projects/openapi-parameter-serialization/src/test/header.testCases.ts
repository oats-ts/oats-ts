import { parameter } from '../parameter'
import { encode } from '../utils'
import { obj, optObj } from './common'
import {
  HBoolField,
  HComplexObjField,
  HEnmField,
  HLitField,
  HMixedEnmField,
  HNumArrField,
  HNumField,
  HObjField,
  HObjOptField,
  HOptBoolField,
  HOptEnmField,
  HOptNumField,
  HOptObjField,
  HOptStrField,
  HStrField,
} from './model'
import {
  hBoolFieldSchema,
  hComplexObjSchema,
  hEnmFieldSchema,
  hLitFieldSchema,
  hMixedEnmFieldSchema,
  hNumArrFieldSchema,
  hNumFieldSchema,
  hObjFieldOptSchema,
  hObjFieldSchema,
  hOptBoolFieldSchema,
  hOptEnmFieldSchema,
  hOptNumFieldSchema,
  hOptObjFieldSchema,
  hOptStrFieldSchema,
  hStrFieldSchema,
} from './schemas'
import { HeaderTestCase } from './types'

export const requiredStringHeader: HeaderTestCase<HStrField> = {
  name: 'required string headers',
  descriptor: {
    descriptor: {
      'X-String-Field': parameter.header.simple.required.primitive(parameter.value.string()),
    },
    schema: hStrFieldSchema,
  },
  data: [
    { model: { 'X-String-Field': 'string' }, serialized: { 'x-string-field': 'string' } },
    { model: { 'X-String-Field': 'hello test' }, serialized: { 'x-string-field': 'hello%20test' } },
  ],
  deserializerErrors: [null, undefined, {}, { 'x-string-fiel': 'string' }],
  serializerErrors: [null, undefined, {} as any, { 'x-string-fiel': 'string' } as any],
}

export const optionalStringHeader: HeaderTestCase<HOptStrField> = {
  name: 'optional string headers',
  descriptor: {
    descriptor: {
      'X-String-Field': parameter.header.simple.primitive(parameter.value.string()),
    },
    schema: hOptStrFieldSchema,
  },
  data: [{ model: {}, serialized: {} }, ...requiredStringHeader.data],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredNumberHeader: HeaderTestCase<HNumField> = {
  name: 'required number headers',
  descriptor: {
    descriptor: {
      'X-Number-Field': parameter.header.simple.required.primitive(parameter.value.number()),
    },
    schema: hNumFieldSchema,
  },
  data: [
    { model: { 'X-Number-Field': 12 }, serialized: { 'x-number-field': '12' } },
    { model: { 'X-Number-Field': 1243.2 }, serialized: { 'x-number-field': '1243%2E2' } },
  ],
  deserializerErrors: [
    null,
    undefined,
    {},
    { 'x-number-fiel': 'string' },
    { 'x-number-field': 'string' },
    { 'x-number-field': 'false' },
  ],
  serializerErrors: [null, undefined, {} as any, { 'x-number-fiel': 'string' } as any],
}

export const optionalNumberHeader: HeaderTestCase<HOptNumField> = {
  name: 'optional number headers',
  descriptor: {
    descriptor: {
      'X-Number-Field': parameter.header.simple.primitive(parameter.value.number()),
    },
    schema: hOptNumFieldSchema,
  },
  data: [{ model: {}, serialized: {} }, ...requiredNumberHeader.data],
  deserializerErrors: [{ 'x-number-field': 'string' }, { 'x-number-field': 'false' }],
  serializerErrors: [],
}

export const requiredBooleanHeader: HeaderTestCase<HBoolField> = {
  name: 'required boolean headers',
  descriptor: {
    descriptor: {
      'X-Boolean-Field': parameter.header.simple.required.primitive(parameter.value.boolean()),
    },
    schema: hBoolFieldSchema,
  },
  data: [
    { model: { 'X-Boolean-Field': false }, serialized: { 'x-boolean-field': 'false' } },
    { model: { 'X-Boolean-Field': true }, serialized: { 'x-boolean-field': 'true' } },
  ],
  deserializerErrors: [
    null,
    undefined,
    {},
    { 'x-number-fiel': 'string' },
    { 'x-boolean-field': 'string' },
    { 'x-boolean-field': '12' },
  ],
  serializerErrors: [null, undefined, {} as any, { 'x-number-fiel': 'string' } as any],
}

export const optionalBooleanHeader: HeaderTestCase<HOptBoolField> = {
  name: 'optional boolean headers',
  descriptor: {
    descriptor: {
      'X-Boolean-Field': parameter.header.simple.primitive(parameter.value.boolean()),
    },
    schema: hOptBoolFieldSchema,
  },
  data: [{ model: {}, serialized: {} }, ...requiredBooleanHeader.data],
  deserializerErrors: [{ 'x-boolean-field': 'string' }, { 'x-boolean-field': '12' }],
  serializerErrors: [],
}

export const requiredEnumHeader: HeaderTestCase<HEnmField> = {
  name: 'required boolean headers',
  descriptor: {
    descriptor: {
      'X-Enum-Field': parameter.header.simple.required.primitive(parameter.value.string()),
    },
    schema: hEnmFieldSchema,
  },
  data: [
    { model: { 'X-Enum-Field': 'cat' }, serialized: { 'x-enum-field': 'cat' } },
    { model: { 'X-Enum-Field': 'dog' }, serialized: { 'x-enum-field': 'dog' } },
    { model: { 'X-Enum-Field': 'racoon' }, serialized: { 'x-enum-field': 'racoon' } },
  ],
  deserializerErrors: [
    null,
    undefined,
    {},
    { 'x-number-fiel': 'string' },
    { 'x-boolean-field': 'string' },
    { 'x-boolean-field': '12' },
  ],
  serializerErrors: [null, undefined, {} as any, { 'X-Enum-Field': 'foo' } as any],
}
export const requiredMixedEnumHeader: HeaderTestCase<HMixedEnmField> = {
  name: 'required mixed enum headers',
  descriptor: {
    descriptor: {
      'X-Enum-Field': parameter.header.simple.required.primitive(
        parameter.value.union([parameter.value.boolean(), parameter.value.number(), parameter.value.string()]),
      ),
    },
    schema: hMixedEnmFieldSchema,
  },
  data: [
    { model: { 'X-Enum-Field': 'cat' }, serialized: { 'x-enum-field': 'cat' } },
    { model: { 'X-Enum-Field': true }, serialized: { 'x-enum-field': 'true' } },
    { model: { 'X-Enum-Field': 125 }, serialized: { 'x-enum-field': '125' } },
  ],
  deserializerErrors: [
    null,
    undefined,
    {},
    { 'x-enum-field': '126' },
    { 'x-enum-field': 'false' },
    { 'x-enum-field': 'hello' },
  ],
  serializerErrors: [
    null,
    undefined,
    {} as any,
    { 'X-Enum-Field': 'foo' } as any,
    { 'X-Enum-Field': false } as any,
    { 'X-Enum-Field': 0 } as any,
  ],
}

export const requiredLiteralHeader: HeaderTestCase<HLitField> = {
  name: 'required boolean headers',
  descriptor: {
    descriptor: {
      'X-Lit-Field': parameter.header.simple.required.primitive(parameter.value.string()),
    },
    schema: hLitFieldSchema,
  },
  data: [{ model: { 'X-Lit-Field': 'cat' }, serialized: { 'x-lit-field': 'cat' } }],
  deserializerErrors: [
    null,
    undefined,
    {},
    { 'x-lit-field': 'string' },
    { 'x-lit-field': '5' },
    { 'x-unrelated-field': 'foo' },
  ],
  serializerErrors: [null, undefined, {} as any, { 'X-Lit-Field': 'foo' } as any],
}

export const optionalEnumHeader: HeaderTestCase<HOptEnmField> = {
  name: 'optional boolean headers',
  descriptor: {
    descriptor: {
      'X-Enum-Field': parameter.header.simple.primitive(parameter.value.string()),
    },
    schema: hOptEnmFieldSchema,
  },
  data: [{ model: {}, serialized: {} }, ...requiredEnumHeader.data],
  deserializerErrors: [{ 'x-enum-field': 'X' }, { 'x-enum-field': '12' }],
  serializerErrors: [],
}

export const requiredNumberArrayHeader: HeaderTestCase<HNumArrField> = {
  name: 'required number array headers',
  descriptor: {
    descriptor: {
      'X-Arr-Field': parameter.header.simple.required.array(parameter.value.number()),
    },
    schema: hNumArrFieldSchema,
  },
  data: [
    {
      model: { 'X-Arr-Field': [1, 2, 3] },
      serialized: { 'x-arr-field': '1,2,3' },
    },
    {
      model: { 'X-Arr-Field': [1.2, 6.12345] },
      serialized: { 'x-arr-field': '1%2E2,6%2E12345' },
    },
    {
      model: { 'X-Arr-Field': [] },
      serialized: { 'x-arr-field': '' },
    },
  ],
  deserializerErrors: [
    { 'x-arr-field': 'X' },
    { 'x-arr-field': 's=12' },
    { 'x-arr-field': 'false' },
    { 'x-arr-field': 'cat,dog' },
  ],
  serializerErrors: [
    null,
    undefined,
    {} as any,
    { 'X-Arr-Field': [false] } as any,
    { 'X-Arr-Field': ['foo'] } as any,
    { 'X-Arr-ield': { s: 'A', b: true, n: 12, e: 'dog', l: 'cat' } } as any,
  ],
}

export const requiredObjectHeader: HeaderTestCase<HObjField> = {
  name: 'required object headers',
  descriptor: {
    descriptor: {
      'X-Obj-Field': parameter.header.simple.required.object(obj),
    },
    schema: hObjFieldSchema,
  },
  data: [
    {
      model: { 'X-Obj-Field': { s: 'A', b: true, n: 12, e: 'dog', l: 'cat' } },
      serialized: { 'x-obj-field': 'b,true,e,dog,l,cat,n,12,s,A' },
    },
    {
      model: { 'X-Obj-Field': { s: 'A B C', b: false, n: 123.123, e: 'dog', l: 'cat' } },
      serialized: { 'x-obj-field': 'b,false,e,dog,l,cat,n,123%2E123,s,A%20B%20C' },
    },
  ],
  deserializerErrors: [
    { 'x-obj-field': 'X' },
    { 'x-obj-field': 's=12' },
    { 'x-obj-field': '12' },
    { 'x-obj-field': 's,A,n,12,e,dog,l,cat' },
  ],
  serializerErrors: [
    null,
    undefined,
    {} as any,
    { 'X-Object-Field': {} } as any,
    { 'X-Object-Field': { s: 'foo' } } as any,
    { 'X-Object-ield': { s: 'A', b: true, n: 12, e: 'dog', l: 'cat' } } as any,
  ],
}

export const requiredExplodeObjectHeader: HeaderTestCase<HObjField> = {
  name: 'required object headers',
  descriptor: {
    descriptor: {
      'X-Obj-Field': parameter.header.simple.exploded.required.object(obj),
    },
    schema: hObjFieldSchema,
  },
  data: [
    {
      model: { 'X-Obj-Field': { s: 'A', b: true, n: 12, e: 'dog', l: 'cat' } },
      serialized: { 'x-obj-field': 'b=true,e=dog,l=cat,n=12,s=A' },
    },
    {
      model: { 'X-Obj-Field': { s: 'A B C', b: false, n: 123.123, e: 'dog', l: 'cat' } },
      serialized: { 'x-obj-field': 'b=false,e=dog,l=cat,n=123%2E123,s=A%20B%20C' },
    },
  ],
  deserializerErrors: [
    { 'x-obj-field': 'X' },
    { 'x-obj-field': 's=12' },
    { 'x-obj-field': '12' },
    { 'x-obj-field': 'e=dog,b=false,l=cat,n=123%2E123' },
    { 'x-obj-field': 'e=dog,b=false,l=cat' },
  ],
  serializerErrors: [
    null,
    undefined,
    {} as any,
    { 'X-Object-Field': {} } as any,
    { 'X-Object-Field': { s: 'foo' } } as any,
    { 'X-Object-ield': { s: 'A', b: true, n: 12, e: 'dog', l: 'cat' } } as any,
  ],
}

export const optionalObjectHeader: HeaderTestCase<HOptObjField> = {
  name: 'optional object headers',
  descriptor: {
    descriptor: {
      'X-Obj-Field': parameter.header.simple.object(obj),
    },
    schema: hOptObjFieldSchema,
  },
  data: [
    {
      model: { 'X-Obj-Field': { s: 'A', b: true, n: 12, e: 'dog', l: 'cat' } },
      serialized: { 'x-obj-field': 'b,true,e,dog,l,cat,n,12,s,A' },
    },
    {
      model: { 'X-Obj-Field': { s: 'A B C', b: false, n: 123.123, e: 'dog', l: 'cat' } },
      serialized: { 'x-obj-field': 'b,false,e,dog,l,cat,n,123%2E123,s,A%20B%20C' },
    },
  ],
  deserializerErrors: [
    { 'x-obj-field': 's,A,n,12,e,dog,l,cat' },
    { 'x-obj-field': 'n,12,e,dog,' },
    { 'x-obj-field': 's,A' },
    { 'x-obj-field': 'n,12,e,dog' },
  ],
  serializerErrors: [
    { 'X-Obj-Field': { s: 'foo', b: false } } as any,
    { 'X-Obj-Field': { s: 'foo' } } as any,
    { 'X-Obj-Field': {} } as any,
  ],
}

export const optionalFieldsObjectHeader: HeaderTestCase<HObjOptField> = {
  name: 'required object headers with optional fields',
  descriptor: {
    descriptor: {
      'X-Obj-Field': parameter.header.simple.required.object(optObj),
    },
    schema: hObjFieldOptSchema,
  },
  data: [
    {
      model: { 'X-Obj-Field': { s: 'A B C', b: false, n: 123.123, e: 'dog', l: 'cat' } },
      serialized: { 'x-obj-field': 'b,false,e,dog,l,cat,n,123%2E123,s,A%20B%20C' },
    },
    {
      model: { 'X-Obj-Field': { b: false, n: 123.123, e: 'dog', l: 'cat' } },
      serialized: { 'x-obj-field': 'b,false,e,dog,l,cat,n,123%2E123' },
    },
    {
      model: { 'X-Obj-Field': { b: false, n: 123.123 } },
      serialized: { 'x-obj-field': 'b,false,n,123%2E123' },
    },
    {
      model: { 'X-Obj-Field': { n: 123.123 } },
      serialized: { 'x-obj-field': 'n,123%2E123' },
    },
    {
      model: { 'X-Obj-Field': {} },
      serialized: { 'x-obj-field': '' },
    },
  ],
  deserializerErrors: [
    null,
    undefined,
    {},
    { 'x-obj-fiel': 's,A,n,12,e,dog,l,cat' },
    { 'x-obj-field': 'hi' },
    { 'x-obj-field': '6' },
  ],
  serializerErrors: [{ 'X-Obj-Field': undefined } as any],
}

export const jsonObjectSchemaHeader: HeaderTestCase<HComplexObjField> = {
  name: 'required complex object headers',
  descriptor: {
    descriptor: {
      'X-Obj-Field': parameter.header.required.schema('application/json'),
    },
    schema: hComplexObjSchema,
  },
  data: [
    {
      model: {
        'X-Obj-Field': { req: { s: 'A B C', b: false, n: 123.123, e: 'dog', l: 'cat' }, opt: { b: false, n: 123.123 } },
      },
      serialized: {
        'x-obj-field': encode(
          JSON.stringify({
            req: { s: 'A B C', b: false, n: 123.123, e: 'dog', l: 'cat' },
            opt: { b: false, n: 123.123 },
          }),
        ),
      },
    },
  ],
  deserializerErrors: [
    // null,
    // undefined,
    // {},
    // { 'x-obj-fiel': 's,A,n,12,e,dog,l,cat' },
    // { 'x-obj-field': 'hi' },
    // { 'x-obj-field': '6' },
    // { 'x-obj-field': JSON.stringify({ foo: 'bar' }) },
  ],
  serializerErrors: [
    // { 'X-Obj-Field': undefined } as any, { 'X-Obj-Field': { req: 'hi' } as any }
  ],
}
