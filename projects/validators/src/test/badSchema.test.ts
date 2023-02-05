import { SchemaRule } from '@oats-ts/rules'
import { DefaultValidator } from '../DefaultValidator'

describe('boolean', () => {
  const v = new DefaultValidator({ type: 'hi' } as unknown as SchemaRule)
  it('should pass', () => {
    expect(v.validate(false)).toHaveLength(0)
    expect(v.validate('asd')).toHaveLength(0)
    expect(v.validate([])).toHaveLength(0)
    expect(v.validate({})).toHaveLength(0)
  })
})
