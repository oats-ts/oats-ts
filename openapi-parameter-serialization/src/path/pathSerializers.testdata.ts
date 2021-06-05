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
