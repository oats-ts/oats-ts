import { number, object, record, string } from '../factories'
import { Validator } from '../Validator'

describe('record', () => {
  const v = new Validator(object(record(string(), number())))
  it('should pass', () => {
    expect(v.validate({})).toHaveLength(0)
    expect(v.validate({ foo: 1, bar: 343.4534, 'foo bar': 123 })).toHaveLength(0)
  })
  it('should fail', () => {
    expect(v.validate(null)).toHaveLength(1)
    expect(v.validate(undefined)).toHaveLength(1)
    expect(v.validate([])).toHaveLength(1)
    expect(v.validate('asd')).toHaveLength(1)
    expect(v.validate(1)).toHaveLength(1)
    expect(v.validate(false)).toHaveLength(1)
  })
})
