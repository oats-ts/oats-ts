import { any } from './any'

describe('any', () => {
  it('should not return any errors', () => {
    expect(any(null)).toEqual([])
    expect(any(undefined)).toEqual([])
    expect(any(1)).toEqual([])
    expect(any(NaN)).toEqual([])
    expect(any('')).toEqual([])
    expect(any({ a: 'foo' })).toEqual([])
    expect(any([1, 2, 3])).toEqual([])
  })
})
