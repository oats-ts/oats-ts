import { nil } from '../factories'
import { Validator } from '../Validator'

describe('nil', () => {
  const v = new Validator(nil())
  it('should pass', () => {
    expect(v.validate(null)).toHaveLength(0)
    expect(v.validate(undefined)).toHaveLength(0)
  })
  it('should fail', () => {
    expect(v.validate(1)).toHaveLength(1)
    expect(v.validate('asd')).toHaveLength(1)
    expect(v.validate([])).toHaveLength(1)
    expect(v.validate({})).toHaveLength(1)
  })
})
