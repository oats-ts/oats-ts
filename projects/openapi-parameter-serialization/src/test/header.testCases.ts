import { dsl } from '../dsl'
import { HeaderTestCase } from './types'

export const requiredStringParam: HeaderTestCase<{ 'X-String-Field': string }> = {
  name: 'required string parameter',
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

export const optionalStringParam: HeaderTestCase<{ 'X-String-Field'?: string }> = {
  name: 'optional string parameter',
  dsl: {
    'X-String-Field': dsl.header.simple.primitive(dsl.value.string(), { required: false }),
  },
  serialize: [{ from: {}, to: {} }, ...requiredStringParam.serialize],
  deserialize: [
    { from: {}, to: {} },
    { from: { 'X-Extra-Header': 'hello' }, to: {} },
    ...requiredStringParam.deserialize,
  ],
  deserializerErrors: [],
  serializerErrors: [],
}
