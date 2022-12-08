import { Schema } from '../typings'
import { Validator } from '../Validator'

describe('boolean', () => {
  const v = new Validator({ type: 'hi' } as unknown as Schema)
  it('should pass', () => {
    expect(v.validate(false)).toHaveLength(0)
    expect(v.validate('asd')).toHaveLength(0)
    expect(v.validate([])).toHaveLength(0)
    expect(v.validate({})).toHaveLength(0)
  })
})
