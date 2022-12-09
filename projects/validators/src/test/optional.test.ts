import { optional, string } from '../factories'
import { Validator } from '../Validator'

describe('optional', () => {
  const v = new Validator(optional(string()))
  it('should pass', () => {
    expect(v.validate('foo')).toHaveLength(0)
    expect(v.validate(null)).toHaveLength(0)
    expect(v.validate(undefined)).toHaveLength(0)
  })
  it('should fail', () => {
    expect(v.validate(1)).toHaveLength(1)
    expect(v.validate([])).toHaveLength(1)
    expect(v.validate({})).toHaveLength(1)
  })
})
