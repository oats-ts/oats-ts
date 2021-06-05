import { QueryTestInput } from '../testUtils'
import { queryFormPrimitive } from './queryFormPrimitive'

const correctCases: QueryTestInput[] = [
  ['foo=bar', {}, 'foo', 'bar'],
  ['cat=1', {}, 'cat', 1],
  ['dog=false', {}, 'dog', false],
  ['x=true', {}, 'x', true],
  ['x=foo bar', { allowReserved: true }, 'x', 'foo bar'],
  ['x=foo%20bar', { allowReserved: false }, 'x', 'foo bar'],
  ['x=5', { defaultValue: 5 }, 'x', undefined],
  ['x', { allowEmptyValue: true }, 'x', undefined],
]

const errorCases: QueryTestInput[] = [
  [undefined, { required: true }, 'foo', undefined],
  [undefined, { required: true }, 'foo', null],
]

describe('query.form.primitive', () => {
  it.each(correctCases)('should be "%s", given options: %s, name %s, value: %s', (expected, options, name, value) => {
    expect(queryFormPrimitive(options)(name)(value)).toBe(expected)
  })
  it.each(errorCases)('should be throw, given options: %s, name %s, value: %s', (expected, options, name, value) => {
    expect(() => queryFormPrimitive(options)(name)(value)).toThrowError()
  })
})
