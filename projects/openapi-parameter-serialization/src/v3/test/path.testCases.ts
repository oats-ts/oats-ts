import { pathToRegexp } from 'path-to-regexp'
import { parsePathToSegments } from '../../parsePathToSegments'
import { dsl } from '../dsl'
import { PathTestCase } from './types'

export const requiredStringQuery: PathTestCase<{ str: string }> = {
  name: 'required simple path string',
  dsl: {
    matcher: pathToRegexp('/foo/:str'),
    pathSegments: parsePathToSegments('/foo/{str}'),
    schema: {
      str: dsl.path.simple.primitive(dsl.value.string(), { required: true }),
    },
  },
  data: [
    { model: { str: 'string' }, serialized: '/foo/string' },
    { model: { str: 'hello test' }, serialized: '/foo/hello%20test' },
  ],
  deserializerErrors: [null, undefined, 'foo', 'sr=foo'],
  serializerErrors: [null, undefined, {} as any, { 'x-string-fiel': 'string' } as any],
}
