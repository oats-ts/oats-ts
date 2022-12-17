import { schemas } from '@oats-ts/rules'
import { Validator } from '../Validator'

describe('integer', () => {
  const v = new Validator(schemas.integer())
  it('should pass', () => {
    expect(v.validate(0)).toHaveLength(0)
    expect(v.validate(1)).toHaveLength(0)
    expect(v.validate(42)).toHaveLength(0)
    expect(v.validate(Number.MAX_SAFE_INTEGER)).toHaveLength(0)
    expect(v.validate(Number.MIN_SAFE_INTEGER)).toHaveLength(0)
  })
  it('should fail', () => {
    expect(v.validate(0.000001)).toHaveLength(1)
    expect(v.validate(0.1)).toHaveLength(1)
    expect(v.validate('cat')).toHaveLength(1)
    expect(v.validate(null)).toHaveLength(1)
    expect(v.validate(undefined)).toHaveLength(1)
    expect(v.validate(NaN)).toHaveLength(1)
  })
})
