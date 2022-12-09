import { minProperties } from '../factories'
import { Validator } from '../Validator'

describe('minProperties', () => {
  const v = new Validator(minProperties(3))
  it('should pass', () => {
    expect(v.validate({ a: 1, b: 2, c: 3 })).toHaveLength(0)
    expect(v.validate({ a: 1, b: 2, c: 3, d: 4 })).toHaveLength(0)
  })
  it('should fail', () => {
    expect(v.validate(1)).toHaveLength(1)
    expect(v.validate('xy')).toHaveLength(1)
    expect(v.validate([])).toHaveLength(1)
    expect(v.validate({ a: 1, b: 2 })).toHaveLength(1)
    expect(v.validate(undefined)).toHaveLength(1)
    expect(v.validate(null)).toHaveLength(1)
    expect(v.validate(1)).toHaveLength(1)
    expect(v.validate(false)).toHaveLength(1)
  })
})
