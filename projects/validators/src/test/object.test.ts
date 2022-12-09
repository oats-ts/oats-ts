import { object } from '../factories'
import { Validator } from '../Validator'

describe('object', () => {
  const v = new Validator(object())
  it('should pass', () => {
    expect(v.validate({})).toHaveLength(0)
    expect(v.validate({ foo: 'bar' })).toHaveLength(0)
    expect(v.validate({ 'asd-asasd': 'bar', 0: 10 })).toHaveLength(0)
  })

  it('should fail', () => {
    expect(v.validate('cat')).toHaveLength(1)
    expect(v.validate(null)).toHaveLength(1)
    expect(v.validate([])).toHaveLength(1)
    expect(v.validate(false)).toHaveLength(1)
    expect(v.validate(1243)).toHaveLength(1)
    expect(v.validate(undefined)).toHaveLength(1)
  })
})
