import { schemas } from '@oats-ts/rules'
import { Validator } from '../Validator'

describe('number', () => {
  const v = new Validator(schemas.number())
  it('should pass', () => {
    expect(v.validate(1)).toHaveLength(0)
    expect(v.validate(1123.123131231)).toHaveLength(0)
  })
  it('should fail', () => {
    expect(v.validate('cat')).toHaveLength(1)
    expect(v.validate(null)).toHaveLength(1)
    expect(v.validate(undefined)).toHaveLength(1)
    expect(v.validate(NaN)).toHaveLength(1)
  })
})
