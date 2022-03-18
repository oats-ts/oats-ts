import { configure } from '../configure'
import { any } from './any'

describe('any', () => {
  it('should not return any errors', () => {
    const v = configure(any())
    expect(v(null)).toEqual([])
    expect(v(undefined)).toEqual([])
    expect(v(1)).toEqual([])
    expect(v(NaN)).toEqual([])
    expect(v('')).toEqual([])
    expect(v({ a: 'foo' })).toEqual([])
    expect(v([1, 2, 3])).toEqual([])
  })
})
