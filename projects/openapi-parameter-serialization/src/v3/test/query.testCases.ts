import { dsl } from '../dsl'
import { QueryTestCase } from './types'

export const requiredStringQuery: QueryTestCase<{ str: string }> = {
  name: 'required string query',
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
  name: 'optional string query',
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
