import { QueryTestData } from '../testUtils'

export const queryFormPrimitiveTestData: QueryTestData = {
  data: [
    [['foo=bar'], {}, 'foo', 'bar'],
    [['cat=1'], {}, 'cat', 1],
    [['dog=false'], {}, 'dog', false],
    [['x=true'], {}, 'x', true],
  ],
  error: [
    [{ required: true }, 'foo', undefined],
    [{ required: true }, 'foo', null],
  ],
}

export const queryFormArrayTestData: QueryTestData = {
  data: [
    [['foo=bar'], {}, 'foo', ['bar']],
    [['foo=a', 'foo=b', 'foo=c'], {}, 'foo', ['a', 'b', 'c']],
    [['foo=a,b,c'], { explode: false }, 'foo', ['a', 'b', 'c']],
  ],
  error: [
    [{ required: true }, 'foo', undefined],
    [{ required: true }, 'foo', null],
  ],
}

export const queryFormObjectTestData: QueryTestData = {
  data: [
    [['a=foo', 'b=1', 'c=false'], {}, 'foo', { a: 'foo', b: 1, c: false }],
    [['foo=a,foo,b,1,c,false'], { explode: false }, 'foo', { a: 'foo', b: 1, c: false }],
  ],
  error: [
    [{ required: true }, 'foo', undefined],
    [{ required: true }, 'foo', null],
  ],
}

export const querySpaceDelimitedArrayTestData: QueryTestData = {
  data: [
    [['foo=bar'], {}, 'foo', ['bar']],
    [['foo=a', 'foo=b', 'foo=c'], {}, 'foo', ['a', 'b', 'c']],
    [['foo=a%20b%20c'], { explode: false }, 'foo', ['a', 'b', 'c']],
  ],
  error: [
    [{ required: true }, 'foo', undefined],
    [{ required: true }, 'foo', null],
  ],
}

export const queryPipeDelimitedArrayTestData: QueryTestData = {
  data: [
    [['foo=bar'], {}, 'foo', ['bar']],
    [['foo=a', 'foo=b', 'foo=c'], {}, 'foo', ['a', 'b', 'c']],
    [['foo=a|b|c'], { explode: false }, 'foo', ['a', 'b', 'c']],
  ],
  error: [
    [{ required: true }, 'foo', undefined],
    [{ required: true }, 'foo', null],
  ],
}

export const queryDeepObjectObjectTestData: QueryTestData = {
  data: [[['foo[a]=foo', 'foo[b]=1', 'foo[c]=false'], {}, 'foo', { a: 'foo', b: 1, c: false }]],
  error: [
    [{ required: true }, 'foo', undefined],
    [{ required: true }, 'foo', null],
    [{ explode: false }, 'foo', { a: 'foo', b: 1, c: false }],
  ],
}
