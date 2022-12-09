import { minLength } from '../factories'
import { Validator } from '../Validator'

describe('minLength', () => {
  const v = new Validator(minLength(3))
  it('should pass', () => {
    expect(v.validate('abc')).toHaveLength(0)
    expect(v.validate(['a', 'b', 'c'])).toHaveLength(0)
    expect(v.validate(['a', 'b', 'c', 'd'])).toHaveLength(0)
  })
  it('should fail', () => {
    expect(v.validate(1)).toHaveLength(1)
    expect(v.validate('xy')).toHaveLength(1)
    expect(v.validate([])).toHaveLength(1)
    expect(v.validate({})).toHaveLength(1)
    expect(v.validate(undefined)).toHaveLength(1)
  })
})
