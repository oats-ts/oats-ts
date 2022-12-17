import { schemas } from '@oats-ts/rules'
import { Validator } from '../Validator'

describe('boolean', () => {
  const v = new Validator(schemas.boolean())
  it('should pass', () => {
    expect(v.validate(false)).toHaveLength(0)
    expect(v.validate(true)).toHaveLength(0)
  })

  it('should fail', () => {
    expect(v.validate('cat')).toHaveLength(1)
    expect(v.validate(null)).toHaveLength(1)
    expect(v.validate(undefined)).toHaveLength(1)
  })
})
