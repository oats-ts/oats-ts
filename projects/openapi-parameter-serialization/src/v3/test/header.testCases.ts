import { dsl } from '../dsl'
import { obj } from './common'
import { EnumType, ObjType } from './model'
import { HeaderTestCase } from './types'

export const requiredStringHeader: HeaderTestCase<{ 'X-String-Field': string }> = {
  name: 'required string headers',
  dsl: {
    'X-String-Field': dsl.header.simple.primitive(dsl.value.string(), { required: true }),
  },
  serialize: [
    { from: { 'X-String-Field': 'string' }, to: { 'x-string-field': 'string' } },
    { from: { 'X-String-Field': 'hello test' }, to: { 'x-string-field': 'hello%20test' } },
  ],
  deserialize: [
    { from: { 'x-string-field': 'string' }, to: { 'X-String-Field': 'string' } },
    { from: { 'x-string-field': 'hello%20test' }, to: { 'X-String-Field': 'hello test' } },
  ],
  deserializerErrors: [null, undefined, {}, { 'x-string-fiel': 'string' }],
  serializerErrors: [null, undefined, {} as any, { 'x-string-fiel': 'string' } as any],
}

export const optionalStringHeader: HeaderTestCase<{ 'X-String-Field'?: string }> = {
  name: 'optional string headers',
  dsl: {
    'X-String-Field': dsl.header.simple.primitive(dsl.value.string(), { required: false }),
  },
  serialize: [{ from: {}, to: {} }, ...requiredStringHeader.serialize],
  deserialize: [
    { from: {}, to: {} },
    { from: { 'X-Extra-Header': 'hello' }, to: {} },
    ...requiredStringHeader.deserialize,
  ],
  deserializerErrors: [],
  serializerErrors: [],
}

export const requiredNumberHeader: HeaderTestCase<{ 'X-Number-Field': number }> = {
  name: 'required number headers',
  dsl: {
    'X-Number-Field': dsl.header.simple.primitive(dsl.value.number(), { required: true }),
  },
  serialize: [
    { from: { 'X-Number-Field': 12 }, to: { 'x-number-field': '12' } },
    { from: { 'X-Number-Field': 1243.2 }, to: { 'x-number-field': '1243%2E2' } },
  ],
  deserialize: [
    { from: { 'x-number-field': '12' }, to: { 'X-Number-Field': 12 } },
    { from: { 'x-number-field': '1243%2E2' }, to: { 'X-Number-Field': 1243.2 } },
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

export const optionalNumberHeader: HeaderTestCase<{ 'X-Number-Field'?: number }> = {
  name: 'optional number headers',
  dsl: {
    'X-Number-Field': dsl.header.simple.primitive(dsl.value.number(), { required: false }),
  },
  serialize: [{ from: {}, to: {} }, ...requiredNumberHeader.serialize],
  deserialize: [
    { from: {}, to: {} },
    { from: { 'X-Extra-Header': 'hello' }, to: {} },
    ...requiredNumberHeader.deserialize,
  ],
  deserializerErrors: [{ 'x-number-field': 'string' }, { 'x-number-field': 'false' }],
  serializerErrors: [],
}

export const requiredBooleanHeader: HeaderTestCase<{ 'X-Boolean-Field': boolean }> = {
  name: 'required boolean headers',
  dsl: {
    'X-Boolean-Field': dsl.header.simple.primitive(dsl.value.boolean(), { required: true }),
  },
  serialize: [
    { from: { 'X-Boolean-Field': false }, to: { 'x-boolean-field': 'false' } },
    { from: { 'X-Boolean-Field': true }, to: { 'x-boolean-field': 'true' } },
  ],
  deserialize: [
    { from: { 'x-boolean-field': 'false' }, to: { 'X-Boolean-Field': false } },
    { from: { 'x-boolean-field': 'true' }, to: { 'X-Boolean-Field': true } },
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

export const optionalBooleanHeader: HeaderTestCase<{ 'X-Boolean-Field'?: boolean }> = {
  name: 'optional boolean headers',
  dsl: {
    'X-Boolean-Field': dsl.header.simple.primitive(dsl.value.boolean(), { required: false }),
  },
  serialize: [{ from: {}, to: {} }, ...requiredBooleanHeader.serialize],
  deserialize: [
    { from: {}, to: {} },
    { from: { 'X-Extra-Header': 'hello' }, to: {} },
    ...requiredBooleanHeader.deserialize,
  ],
  deserializerErrors: [{ 'x-boolean-field': 'string' }, { 'x-boolean-field': '12' }],
  serializerErrors: [],
}

export const requiredEnumHeader: HeaderTestCase<{ 'X-Enum-Field': EnumType }> = {
  name: 'required boolean headers',
  dsl: {
    'X-Enum-Field': dsl.header.simple.primitive(dsl.value.string(dsl.value.enum(['cat', 'dog', 'racoon'])), {
      required: true,
    }),
  },
  serialize: [
    { from: { 'X-Enum-Field': 'cat' }, to: { 'x-enum-field': 'cat' } },
    { from: { 'X-Enum-Field': 'dog' }, to: { 'x-enum-field': 'dog' } },
    { from: { 'X-Enum-Field': 'racoon' }, to: { 'x-enum-field': 'racoon' } },
  ],
  deserialize: [
    { from: { 'x-enum-field': 'cat' }, to: { 'X-Enum-Field': 'cat' } },
    { from: { 'x-enum-field': 'dog' }, to: { 'X-Enum-Field': 'dog' } },
    { from: { 'x-enum-field': 'racoon' }, to: { 'X-Enum-Field': 'racoon' } },
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

export const optionalEnumHeader: HeaderTestCase<{ 'X-Enum-Field'?: EnumType }> = {
  name: 'optional boolean headers',
  dsl: {
    'X-Enum-Field': dsl.header.simple.primitive(dsl.value.string(dsl.value.enum(['cat', 'dog', 'racoon'])), {
      required: false,
    }),
  },
  serialize: [{ from: {}, to: {} }, ...requiredEnumHeader.serialize],
  deserialize: [
    { from: {}, to: {} },
    { from: { 'X-Extra-Header': 'hello' }, to: {} },
    ...requiredEnumHeader.deserialize,
  ],
  deserializerErrors: [{ 'x-enum-field': 'X' }, { 'x-enum-field': '12' }],
  serializerErrors: [],
}

export const requiredObjectHeader: HeaderTestCase<{ 'X-Obj-Field': ObjType }> = {
  name: 'required object headers',
  dsl: {
    'X-Obj-Field': dsl.header.simple.object(obj, { required: true }),
  },
  serialize: [
    {
      from: { 'X-Obj-Field': { s: 'A', b: true, n: 12, e: 'dog', l: 'cat' } },
      to: { 'x-obj-field': 'b,true,e,dog,l,cat,n,12,s,A' },
    },
    {
      from: { 'X-Obj-Field': { s: 'A B C', b: false, n: 123.123, e: 'dog', l: 'cat' } },
      to: { 'x-obj-field': 'b,false,e,dog,l,cat,n,123%2E123,s,A%20B%20C' },
    },
  ],
  deserialize: [
    {
      from: { 'x-obj-field': 's,A,b,true,n,12,e,dog,l,cat' },
      to: { 'X-Obj-Field': { s: 'A', b: true, n: 12, e: 'dog', l: 'cat' } },
    },
    {
      from: { 'x-obj-field': 's,A%20B%20C,b,false,n,123%2E123,e,dog,l,cat' },
      to: { 'X-Obj-Field': { s: 'A B C', b: false, n: 123.123, e: 'dog', l: 'cat' } },
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

export const optionalObjectHeader: HeaderTestCase<{ 'X-Obj-Field'?: ObjType }> = {
  name: 'optional object headers',
  dsl: {
    'X-Obj-Field': dsl.header.simple.object(obj, { required: false }),
  },
  serialize: [
    {
      from: { 'X-Obj-Field': { s: 'A', b: true, n: 12, e: 'dog', l: 'cat' } },
      to: { 'x-obj-field': 'b,true,e,dog,l,cat,n,12,s,A' },
    },
    {
      from: { 'X-Obj-Field': { s: 'A B C', b: false, n: 123.123, e: 'dog', l: 'cat' } },
      to: { 'x-obj-field': 'b,false,e,dog,l,cat,n,123%2E123,s,A%20B%20C' },
    },
  ],
  deserialize: [
    {
      from: { 'x-obj-field': 's,A,b,true,n,12,e,dog,l,cat' },
      to: { 'X-Obj-Field': { s: 'A', b: true, n: 12, e: 'dog', l: 'cat' } },
    },
    {
      from: { 'x-obj-field': 's,A%20B%20C,b,false,n,123%2E123,e,dog,l,cat' },
      to: { 'X-Obj-Field': { s: 'A B C', b: false, n: 123.123, e: 'dog', l: 'cat' } },
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
