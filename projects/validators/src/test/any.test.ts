import { schemas } from '@oats-ts/rules'
import { DefaultValidator } from '../DefaultValidator'

describe('any', () => {
  const v = new DefaultValidator(schemas.any())
  it('should pass', () => {
    expect(v.validate(null)).toEqual([])
    expect(v.validate(undefined)).toEqual([])
    expect(v.validate(1)).toEqual([])
    expect(v.validate(NaN)).toEqual([])
    expect(v.validate('')).toEqual([])
    expect(v.validate({ a: 'foo' })).toEqual([])
    expect(v.validate([1, 2, 3])).toEqual([])
  })
})
