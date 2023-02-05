import { schemas } from '@oats-ts/rules'
import { DefaultValidator } from '../DefaultValidator'

describe('boolean', () => {
  const v = new DefaultValidator(schemas.boolean())
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
