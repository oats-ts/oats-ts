import { maxLength } from '../factories'
import { Validator } from '../Validator'

describe('maxLength', () => {
  const v = new Validator(maxLength(3))
  it('should pass', () => {
    expect(v.validate('a')).toHaveLength(0)
    expect(v.validate('abc')).toHaveLength(0)
    expect(v.validate(['a'])).toHaveLength(0)
    expect(v.validate(['a', 'b'])).toHaveLength(0)
    expect(v.validate(['a', 'b', 'c'])).toHaveLength(0)
  })
  it('should fail', () => {
    expect(v.validate(['a', 'b', 'c', 'd', 'e'])).toHaveLength(1)
    expect(v.validate('xyyz')).toHaveLength(1)
    expect(v.validate(undefined)).toHaveLength(1)
    expect(v.validate(null)).toHaveLength(1)
    expect(v.validate(1)).toHaveLength(1)
    expect(v.validate(false)).toHaveLength(1)
  })
})
