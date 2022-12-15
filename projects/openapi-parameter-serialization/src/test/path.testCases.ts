import { pathToRegexp } from 'path-to-regexp'
import { parsePathToSegments } from '../parsePathToSegments'
import { obj } from './common'
import { ComplexObj, EnumType, LiteralType, ObjType } from './model'
import { PathTestCase } from './types'
import { parameter } from '../parameter'
import { encode } from '../utils'

export const requiredSimpleStringPath: PathTestCase<{ str: string }> = {
  name: 'required simple path string',
  descriptor: {
    matcher: pathToRegexp('/foo/:str'),
    pathSegments: parsePathToSegments('/foo/{str}'),
    descriptor: {
      str: parameter.path.simple.required.primitive(parameter.value.string()),
    },
  },
  data: [
    { model: { str: 'string' }, serialized: '/foo/string' },
    { model: { str: 'hello test' }, serialized: '/foo/hello%20test' },
  ],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined, { str: '' }],
}

export const requiredSimpleNumberPath: PathTestCase<{ num: number }> = {
  name: 'required simple path number',
  descriptor: {
    matcher: pathToRegexp('/foo/:num'),
    pathSegments: parsePathToSegments('/foo/{num}'),
    descriptor: {
      num: parameter.path.simple.required.primitive(parameter.value.number()),
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
  descriptor: {
    matcher: pathToRegexp('/foo/:bool'),
    pathSegments: parsePathToSegments('/foo/{bool}'),
    descriptor: {
      bool: parameter.path.simple.required.primitive(parameter.value.boolean()),
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
  name: 'required simple path literal',
  descriptor: {
    matcher: pathToRegexp('/foo/:lit'),
    pathSegments: parsePathToSegments('/foo/{lit}'),
    descriptor: {
      lit: parameter.path.simple.required.primitive(parameter.value.string()),
    },
  },
  data: [{ model: { lit: 'cat' }, serialized: '/foo/cat' }],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined],
}

export const requiredSimpleEnumPath: PathTestCase<{ enm: EnumType }> = {
  name: 'required simple path enum',
  descriptor: {
    matcher: pathToRegexp('/foo/:enm'),
    pathSegments: parsePathToSegments('/foo/{enm}'),
    descriptor: {
      enm: parameter.path.simple.required.primitive(parameter.value.string()),
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
  name: 'required simple path string[]',
  descriptor: {
    matcher: pathToRegexp('/foo/:arr'),
    pathSegments: parsePathToSegments('/foo/{arr}'),
    descriptor: {
      arr: parameter.path.simple.required.array(parameter.value.string()),
    },
  },
  data: [
    { model: { arr: ['a', 'b', 'c'] }, serialized: '/foo/a,b,c' },
    { model: { arr: ['a b c', 'c b a'] }, serialized: '/foo/a%20b%20c,c%20b%20a' },
    { model: { arr: ['this is a long param'] }, serialized: '/foo/this%20is%20a%20long%20param' },
  ],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined, { arr: undefined! }, { arr: [] }, { arr: [''] }],
}

export const requiredSimpleObjectPath: PathTestCase<{ obj: ObjType }> = {
  name: 'required simple path object',
  descriptor: {
    matcher: pathToRegexp('/foo/:obj'),
    pathSegments: parsePathToSegments('/foo/{obj}'),
    descriptor: {
      obj: parameter.path.simple.required.object(obj),
    },
  },
  data: [
    {
      model: { obj: { s: 'str', b: false, n: 123, e: 'racoon', l: 'cat' } },
      serialized: '/foo/s,str,b,false,n,123,e,racoon,l,cat',
    },
    {
      model: { obj: { s: 'some long str', b: false, n: 123, e: 'dog', l: 'cat' } },
      serialized: '/foo/s,some%20long%20str,b,false,n,123,e,dog,l,cat',
    },
  ],
  deserializerErrors: [null, undefined, '/foo/s,str,b,false,n,123,e,racoon,l'],
  serializerErrors: [null, undefined, { obj: {} as any }],
}

export const requiredExplodeSimpleObjectPath: PathTestCase<{ obj: ObjType }> = {
  name: 'required exploded simple path object',
  descriptor: {
    matcher: pathToRegexp('/foo/:obj'),
    pathSegments: parsePathToSegments('/foo/{obj}'),
    descriptor: {
      obj: parameter.path.simple.exploded.required.object(obj),
    },
  },
  data: [
    {
      model: { obj: { s: 'str', b: false, n: 123, e: 'racoon', l: 'cat' } },
      serialized: '/foo/s=str,b=false,n=123,e=racoon,l=cat',
    },
    {
      model: { obj: { s: 'some long str', b: false, n: 123, e: 'dog', l: 'cat' } },
      serialized: '/foo/s=some%20long%20str,b=false,n=123,e=dog,l=cat',
    },
  ],
  deserializerErrors: [
    null,
    undefined,
    '/foo/s=str,b=false,n=123,e=racoon,l',
    '/foo/s=str,b=false,n=123,e=racoon,l=cat,impostor=sus',
  ],
  serializerErrors: [null, undefined],
}

export const requiredLabelStringPath: PathTestCase<{ str: string }> = {
  name: 'required label path string',
  descriptor: {
    matcher: pathToRegexp('/foo/:str'),
    pathSegments: parsePathToSegments('/foo/{str}'),
    descriptor: {
      str: parameter.path.label.required.primitive(parameter.value.string()),
    },
  },
  data: [
    { model: { str: 'string' }, serialized: '/foo/.string' },
    { model: { str: 'hello test' }, serialized: '/foo/.hello%20test' },
  ],
  deserializerErrors: [null, undefined, '/foo/wrongstart'],
  serializerErrors: [null, undefined, { str: '' }],
}

export const requiredLabelStringArrayPath: PathTestCase<{ arr: string[] }> = {
  name: 'required label path string[]',
  descriptor: {
    matcher: pathToRegexp('/foo/:arr'),
    pathSegments: parsePathToSegments('/foo/{arr}'),
    descriptor: {
      arr: parameter.path.label.required.array(parameter.value.string()),
    },
  },
  data: [
    { model: { arr: ['str', 'foo', 'bar'] }, serialized: '/foo/.str,foo,bar' },
    { model: { arr: ['hello label', 'hello label 2'] }, serialized: '/foo/.hello%20label,hello%20label%202' },
  ],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined, { arr: [] }, { arr: [''] }],
}

export const requiredExplodeLabelStringArrayPath: PathTestCase<{ arr: string[] }> = {
  name: 'required exploded label path string[]',
  descriptor: {
    matcher: pathToRegexp('/foo/:arr'),
    pathSegments: parsePathToSegments('/foo/{arr}'),
    descriptor: {
      arr: parameter.path.label.exploded.required.array(parameter.value.string()),
    },
  },
  data: [
    { model: { arr: ['str', 'foo', 'bar'] }, serialized: '/foo/.str.foo.bar' },
    { model: { arr: ['hello label', 'hello label 2'] }, serialized: '/foo/.hello%20label.hello%20label%202' },
  ],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined, { arr: [] }, { arr: [''] }],
}

export const requiredLabelObjectPath: PathTestCase<{ obj: ObjType }> = {
  name: 'required label path object',
  descriptor: {
    matcher: pathToRegexp('/foo/:obj'),
    pathSegments: parsePathToSegments('/foo/{obj}'),
    descriptor: {
      obj: parameter.path.label.required.object(obj),
    },
  },
  data: [
    {
      model: { obj: { s: 'str', b: false, n: 123, e: 'racoon', l: 'cat' } },
      serialized: '/foo/.s,str,b,false,n,123,e,racoon,l,cat',
    },
    {
      model: { obj: { s: 'some long str', b: false, n: 123, e: 'dog', l: 'cat' } },
      serialized: '/foo/.s,some%20long%20str,b,false,n,123,e,dog,l,cat',
    },
  ],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined, { obj: {} as any }],
}

export const requiredExplodeLabelObjectPath: PathTestCase<{ obj: ObjType }> = {
  name: 'required exploded label path object',
  descriptor: {
    matcher: pathToRegexp('/foo/:obj'),
    pathSegments: parsePathToSegments('/foo/{obj}'),
    descriptor: {
      obj: parameter.path.label.exploded.required.object(obj),
    },
  },
  data: [
    {
      model: { obj: { s: 'str', b: false, n: 123, e: 'racoon', l: 'cat' } },
      serialized: '/foo/.s=str.b=false.n=123.e=racoon.l=cat',
    },
    {
      model: { obj: { s: 'some long str', b: false, n: 123, e: 'dog', l: 'cat' } },
      serialized: '/foo/.s=some%20long%20str.b=false.n=123.e=dog.l=cat',
    },
  ],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined, { obj: {} as any }],
}

export const requiredMatrixStringPath: PathTestCase<{ str: string }> = {
  name: 'required matrix path string',
  descriptor: {
    matcher: pathToRegexp('/foo/:str'),
    pathSegments: parsePathToSegments('/foo/{str}'),
    descriptor: {
      str: parameter.path.matrix.required.primitive(parameter.value.string()),
    },
  },
  data: [
    { model: { str: 'string' }, serialized: '/foo/;str=string' },
    { model: { str: 'hello test' }, serialized: '/foo/;str=hello%20test' },
  ],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined, { str: '' }],
}

export const requiredMatrixStringArrayPath: PathTestCase<{ arr: string[] }> = {
  name: 'required matrix path string[]',
  descriptor: {
    matcher: pathToRegexp('/foo/:arr'),
    pathSegments: parsePathToSegments('/foo/{arr}'),
    descriptor: {
      arr: parameter.path.matrix.required.array(parameter.value.string()),
    },
  },
  data: [
    { model: { arr: ['str', 'foo', 'bar'] }, serialized: '/foo/;arr=str,foo,bar' },
    { model: { arr: ['hello label', 'hello label 2'] }, serialized: '/foo/;arr=hello%20label,hello%20label%202' },
  ],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined, { arr: [] }, { arr: [''] }],
}

export const requiredExplodeMatrixStringArrayPath: PathTestCase<{ arr: string[] }> = {
  name: 'required exploded matrix path string[]',
  descriptor: {
    matcher: pathToRegexp('/foo/:arr'),
    pathSegments: parsePathToSegments('/foo/{arr}'),
    descriptor: {
      arr: parameter.path.matrix.exploded.required.array(parameter.value.string()),
    },
  },
  data: [
    { model: { arr: ['str', 'foo', 'bar'] }, serialized: '/foo/;arr=str;arr=foo;arr=bar' },
    { model: { arr: ['hello label', 'hello label 2'] }, serialized: '/foo/;arr=hello%20label;arr=hello%20label%202' },
  ],
  deserializerErrors: [null, undefined, '/foo/;arr=str;arr=foo;arr', '/foo/;arr=str;arr=foo;foo=bar', '!obj=s'],
  serializerErrors: [null, undefined, { arr: [] }, { arr: [''] }],
}

export const requiredMatrixObjectPath: PathTestCase<{ obj: ObjType }> = {
  name: 'required matrix path object',
  descriptor: {
    matcher: pathToRegexp('/foo/:obj'),
    pathSegments: parsePathToSegments('/foo/{obj}'),
    descriptor: {
      obj: parameter.path.matrix.required.object(obj),
    },
  },
  data: [
    {
      model: { obj: { s: 'str', b: false, n: 123, e: 'racoon', l: 'cat' } },
      serialized: '/foo/;obj=s,str,b,false,n,123,e,racoon,l,cat',
    },
    {
      model: { obj: { s: 'some long str', b: false, n: 123, e: 'dog', l: 'cat' } },
      serialized: '/foo/;obj=s,some%20long%20str,b,false,n,123,e,dog,l,cat',
    },
  ],
  deserializerErrors: [null, undefined, '!obj=s'],
  serializerErrors: [null, undefined, { obj: {} as any }],
}

export const requiredExplodedMatrixObjectPath: PathTestCase<{ obj: ObjType }> = {
  name: 'required exploded matrix path object',
  descriptor: {
    matcher: pathToRegexp('/foo/:obj'),
    pathSegments: parsePathToSegments('/foo/{obj}'),
    descriptor: {
      obj: parameter.path.matrix.exploded.required.object(obj),
    },
  },
  data: [
    {
      model: { obj: { s: 'str', b: false, n: 123, e: 'racoon', l: 'cat' } },
      serialized: '/foo/;s=str;b=false;n=123;e=racoon;l=cat',
    },
    {
      model: { obj: { s: 'some long str', b: false, n: 123, e: 'dog', l: 'cat' } },
      serialized: '/foo/;s=some%20long%20str;b=false;n=123;e=dog;l=cat',
    },
  ],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined, { obj: {} as any }],
}

export const jsonComplexObjectPath: PathTestCase<{ obj: ComplexObj }> = {
  name: 'required complex path object',
  descriptor: {
    matcher: pathToRegexp('/foo/:obj/bar'),
    pathSegments: parsePathToSegments('/foo/{obj}/bar'),
    descriptor: {
      obj: parameter.path.required.schema('application/json'),
    },
  },
  data: [
    {
      model: { obj: { req: { s: 'A B C', b: false, n: 123.123, e: 'dog', l: 'cat' }, opt: { b: false, n: 123.123 } } },
      serialized: `/foo/${encode(
        JSON.stringify({
          req: { s: 'A B C', b: false, n: 123.123, e: 'dog', l: 'cat' },
          opt: { b: false, n: 123.123 },
        }),
      )}/bar`,
    },
  ],
  deserializerErrors: [null, undefined],
  serializerErrors: [null, undefined, { obj: {} as any }],
}
