import { schemas } from '@oats-ts/rules'
import { DefaultValidator } from '../DefaultValidator'

describe('literal', () => {
  const v = new DefaultValidator(schemas.literal('foo'))
  it('should pass', () => {
    expect(v.validate('foo')).toHaveLength(0)
  })
  it('should fail', () => {
    expect(v.validate(null)).toHaveLength(1)
    expect(v.validate(undefined)).toHaveLength(1)
    expect(v.validate(1)).toHaveLength(1)
    expect(v.validate('asd')).toHaveLength(1)
    expect(v.validate([])).toHaveLength(1)
    expect(v.validate({})).toHaveLength(1)
  })
})
