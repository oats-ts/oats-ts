import { pathToRegexp } from 'path-to-regexp'
import { parsePathToSegments } from '../../parsePathToSegments'
import { dsl } from '../dsl'
import { enm, lit } from './common'
import { EnumType, LiteralType } from './model'
import { PathTestCase } from './types'

export const requiredSimpleStringPath: PathTestCase<{ str: string }> = {
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
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined],
}

export const requiredSimpleNumberPath: PathTestCase<{ num: number }> = {
  name: 'required simple path number',
  dsl: {
    matcher: pathToRegexp('/foo/:num'),
    pathSegments: parsePathToSegments('/foo/{num}'),
    schema: {
      num: dsl.path.simple.primitive(dsl.value.number(), { required: true }),
    },
  },
  data: [
    { model: { num: 1 }, serialized: '/foo/1' },
    { model: { num: 2.234 }, serialized: '/foo/2%2E234' },
  ],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined],
}

export const requiredSimpleBooleanPath: PathTestCase<{ bool: boolean }> = {
  name: 'required simple path boolean',
  dsl: {
    matcher: pathToRegexp('/foo/:bool'),
    pathSegments: parsePathToSegments('/foo/{bool}'),
    schema: {
      bool: dsl.path.simple.primitive(dsl.value.boolean(), { required: true }),
    },
  },
  data: [
    { model: { bool: false }, serialized: '/foo/false' },
    { model: { bool: true }, serialized: '/foo/true' },
  ],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined],
}

export const requiredSimpleLiteralPath: PathTestCase<{ lit: LiteralType }> = {
  name: 'required simple path boolean',
  dsl: {
    matcher: pathToRegexp('/foo/:lit'),
    pathSegments: parsePathToSegments('/foo/{lit}'),
    schema: {
      lit: dsl.path.simple.primitive(lit, { required: true }),
    },
  },
  data: [{ model: { lit: 'cat' }, serialized: '/foo/cat' }],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined],
}

export const requiredSimpleEnumPath: PathTestCase<{ enm: EnumType }> = {
  name: 'required simple path boolean',
  dsl: {
    matcher: pathToRegexp('/foo/:enm'),
    pathSegments: parsePathToSegments('/foo/{enm}'),
    schema: {
      enm: dsl.path.simple.primitive(enm, { required: true }),
    },
  },
  data: [
    { model: { enm: 'cat' }, serialized: '/foo/cat' },
    { model: { enm: 'dog' }, serialized: '/foo/dog' },
    { model: { enm: 'racoon' }, serialized: '/foo/racoon' },
  ],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined],
}

export const requiredSimpleStringArrayPath: PathTestCase<{ arr: string[] }> = {
  name: 'required simple path boolean',
  dsl: {
    matcher: pathToRegexp('/foo/:arr'),
    pathSegments: parsePathToSegments('/foo/{arr}'),
    schema: {
      arr: dsl.path.simple.array(dsl.value.string(), { required: true }),
    },
  },
  data: [
    { model: { arr: ['a', 'b', 'c'] }, serialized: '/foo/a,b,c' },
    { model: { arr: ['a b c'] }, serialized: '/foo/a%20b%20c' },
    { model: { arr: ['this is a long param'] }, serialized: '/foo/this%20is%20a%20long%20param' },
  ],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined],
}
