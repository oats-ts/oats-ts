import { PathTestData } from '../testUtils'

export const pathSimplePrimitiveTestData: PathTestData = {
  data: [
    ['bar', {}, 'foo', 'bar'],
    ['foo%20bar', {}, 'foo', 'foo bar'],
    ['foo bar', { allowReserved: true }, 'foo', 'foo bar'],
    ['1', {}, 'foo', 1],
    ['false', {}, 'foo', false],
    ['true', {}, 'foo', true],
  ],
  error: [
    [{}, 'foo', undefined],
    [{}, 'foo', null],
  ],
}

export const pathSimpleArrayTestData: PathTestData = {
  data: [
    ['bar,foo', {}, 'foo', ['bar', 'foo']],
    ['foo%20bar,a', {}, 'foo', ['foo bar', 'a']],
    ['foo bar,a', { allowReserved: true }, 'foo', ['foo bar', 'a']],
    ['1,2,3', {}, 'foo', [1, 2, 3]],
    ['true,false,true', {}, 'foo', [true, false, true]],
    ['true', {}, 'foo', [true]],
  ],
  error: [
    [{}, 'foo', undefined],
    [{}, 'foo', null],
    [{}, 'foo', []],
  ],
}

export const pathSimpleObjectTestData: PathTestData = {
  data: [
    ['a,a,b,1,c,true', {}, 'foo', { a: 'a', b: 1, c: true }],
    ['a=a,b=1,c=true', { explode: true }, 'foo', { a: 'a', b: 1, c: true }],
  ],
  error: [
    [{}, 'foo', undefined],
    [{}, 'foo', null],
    [{}, 'foo', {}],
  ],
}

export const pathLabelPrimitiveTestData: PathTestData = {
  data: [
    ['.bar', {}, 'foo', 'bar'],
    ['.foo%20bar', {}, 'foo', 'foo bar'],
    ['.foo bar', { allowReserved: true }, 'foo', 'foo bar'],
    ['.1', {}, 'foo', 1],
    ['.false', {}, 'foo', false],
    ['.true', {}, 'foo', true],
  ],
  error: [
    [{}, 'foo', undefined],
    [{}, 'foo', null],
  ],
}

export const pathLabelArrayTestData: PathTestData = {
  data: [
    ['.bar,foo', {}, 'foo', ['bar', 'foo']],
    ['.bar.foo', { explode: true }, 'foo', ['bar', 'foo']],
    ['.foo%20bar,a', {}, 'foo', ['foo bar', 'a']],
    ['.foo%20bar.a', { explode: true }, 'foo', ['foo bar', 'a']],
    ['.foo bar,a', { allowReserved: true }, 'foo', ['foo bar', 'a']],
    ['.1,2,3', {}, 'foo', [1, 2, 3]],
    ['.true,false,true', {}, 'foo', [true, false, true]],
    ['.true', {}, 'foo', [true]],
  ],
  error: [
    [{}, 'foo', undefined],
    [{}, 'foo', null],
    [{}, 'foo', []],
  ],
}

export const pathLabelObjectTestData: PathTestData = {
  data: [
    ['.a,a,b,1,c,true', {}, 'foo', { a: 'a', b: 1, c: true }],
    ['.a=a,b=1,c=true', { explode: true }, 'foo', { a: 'a', b: 1, c: true }],
  ],
  error: [
    [{}, 'foo', undefined],
    [{}, 'foo', null],
    [{}, 'foo', {}],
  ],
}

export const pathMatrixPrimitiveTestData: PathTestData = {
  data: [
    [';foo=bar', {}, 'foo', 'bar'],
    [';foo=foo%20bar', {}, 'foo', 'foo bar'],
    [';foo=foo bar', { allowReserved: true }, 'foo', 'foo bar'],
    [';foo=1', {}, 'foo', 1],
    [';foo=false', {}, 'foo', false],
    [';foo=true', {}, 'foo', true],
  ],
  error: [
    [{}, 'foo', undefined],
    [{}, 'foo', null],
  ],
}

export const pathMatrixArrayTestData: PathTestData = {
  data: [
    [';foo=bar,foo', {}, 'foo', ['bar', 'foo']],
    [';foo=bar;foo=foo', { explode: true }, 'foo', ['bar', 'foo']],
    [';foo=foo%20bar,a', {}, 'foo', ['foo bar', 'a']],
    [';foo=foo%20bar;foo=a', { explode: true }, 'foo', ['foo bar', 'a']],
    [';foo=foo bar,a', { allowReserved: true }, 'foo', ['foo bar', 'a']],
    [';foo=1,2,3', {}, 'foo', [1, 2, 3]],
    [';foo=true,false,true', {}, 'foo', [true, false, true]],
    [';foo=true', {}, 'foo', [true]],
  ],
  error: [
    [{}, 'foo', undefined],
    [{}, 'foo', null],
    [{}, 'foo', []],
  ],
}

export const pathMatrixObjectTestData: PathTestData = {
  data: [
    [';foo=a,a,b,1,c,true', {}, 'foo', { a: 'a', b: 1, c: true }],
    [';a=a;b=1;c=true', { explode: true }, 'foo', { a: 'a', b: 1, c: true }],
  ],
  error: [
    [{}, 'foo', undefined],
    [{}, 'foo', null],
    [{}, 'foo', {}],
  ],
}
