import { array } from '../factories'
import { Validator } from '../Validator'

describe('array', () => {
  const v = new Validator(array())
  it('should pass', () => {
    expect(v.validate([])).toHaveLength(0)
    expect(v.validate(['hi'])).toHaveLength(0)
    expect(v.validate([1, 'hi', false])).toHaveLength(0)
  })
  it('should fail', () => {
    expect(v.validate({})).toHaveLength(1)
    expect(v.validate('cat')).toHaveLength(1)
    expect(v.validate(null)).toHaveLength(1)
    expect(v.validate(undefined)).toHaveLength(1)
  })
})
