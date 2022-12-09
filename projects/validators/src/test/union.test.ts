import { literal, object, string, union } from '../factories'
import { Validator } from '../Validator'

describe('union', () => {
  const v = new Validator(
    union({
      string: string(),
      '42': literal(42),
      object: object(),
    }),
  )
  it('should pass', () => {
    expect(v.validate({})).toHaveLength(0)
    expect(v.validate({ hello: 'world' })).toHaveLength(0)
    expect(v.validate(42)).toHaveLength(0)
    expect(v.validate('foo')).toHaveLength(0)
  })
  it('should fail', () => {
    expect(v.validate(null)).toHaveLength(1)
    expect(v.validate(undefined)).toHaveLength(1)
    expect(v.validate([])).toHaveLength(1)
    expect(v.validate(1)).toHaveLength(1)
  })
})
