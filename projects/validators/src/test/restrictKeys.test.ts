import { schemas } from '@oats-ts/rules'
import { DefaultValidator } from '../DefaultValidator'

describe('restrictKeys', () => {
  const v = new DefaultValidator(schemas.object(schemas.restrictKeys(['a', 'b', 'c'])))
  it('should pass', () => {
    expect(v.validate({})).toHaveLength(0)
    expect(v.validate({ a: 1 })).toHaveLength(0)
    expect(v.validate({ b: 1 })).toHaveLength(0)
    expect(v.validate({ c: 1 })).toHaveLength(0)
    expect(v.validate({ a: 1, b: 2 })).toHaveLength(0)
    expect(v.validate({ a: 1, c: 3 })).toHaveLength(0)
    expect(v.validate({ b: 1, c: 3 })).toHaveLength(0)
  })
  it('should fail', () => {
    expect(v.validate(null)).toHaveLength(1)
    expect(v.validate(undefined)).toHaveLength(1)
    expect(v.validate([])).toHaveLength(1)
    expect(v.validate('asd')).toHaveLength(1)
    expect(v.validate(1)).toHaveLength(1)
    expect(v.validate({ d: 12 })).toHaveLength(1)
    expect(v.validate({ efg: 12 })).toHaveLength(1)
  })
})
