import { maxProperties } from '../factories'
import { Validator } from '../Validator'

describe('minProperties', () => {
  const v = new Validator(maxProperties(3))
  it('should pass', () => {
    expect(v.validate({ a: 1, b: 2, c: 3 })).toHaveLength(0)
    expect(v.validate({ a: 1, b: 2 })).toHaveLength(0)
    expect(v.validate({ a: 1 })).toHaveLength(0)
    expect(v.validate({})).toHaveLength(0)
  })
  it('should fail', () => {
    expect(v.validate({ a: 1, b: 2, c: 3, d: 4 })).toHaveLength(1)
  })
})
