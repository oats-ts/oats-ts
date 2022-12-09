import { lazy, string } from '../factories'
import { Validator } from '../Validator'

describe('lazy', () => {
  const v = new Validator(lazy(() => string()))
  it('should pass', () => {
    expect(v.validate('cat')).toHaveLength(0)
    expect(v.validate('')).toHaveLength(0)
    expect(v.validate('longer string')).toHaveLength(0)
  })
  it('should fail', () => {
    expect(v.validate(1)).toHaveLength(1)
    expect(v.validate(null)).toHaveLength(1)
    expect(v.validate(undefined)).toHaveLength(1)
  })
})