import { HeaderTestData } from '../testUtils'

export const headerSimplePrimitiveTestData: HeaderTestData = {
  data: [
    ['bar', {}, 'foo', 'bar'],
    ['foo%20bar', {}, 'foo', 'foo bar'],
    ['1', {}, 'foo', 1],
    ['false', {}, 'foo', false],
    ['true', {}, 'foo', true],
  ],
  error: [
    [{ required: true }, 'foo', undefined],
    [{ required: true }, 'foo', null],
  ],
}

export const headerSimpleArrayTestData: HeaderTestData = {
  data: [
    ['bar,foo', {}, 'foo', ['bar', 'foo']],
    ['foo%20bar,a', {}, 'foo', ['foo bar', 'a']],
    ['1,2,3', {}, 'foo', [1, 2, 3]],
    ['true,false,true', {}, 'foo', [true, false, true]],
    ['true', {}, 'foo', [true]],
  ],
  error: [
    [{ required: true }, 'foo', undefined],
    [{ required: true }, 'foo', null],
  ],
}

export const headerSimpleObjectTestData: HeaderTestData = {
  data: [
    ['a,a,b,1,c,true', {}, 'foo', { a: 'a', b: 1, c: true }],
    ['a=a,b=1,c=true', { explode: true }, 'foo', { a: 'a', b: 1, c: true }],
  ],
  error: [
    [{ required: true }, 'foo', undefined],
    [{ required: true }, 'foo', null],
  ],
}
