import { boolean, intersection, number, object, shape, string } from '../factories'
import { Validator } from '../Validator'

describe('intersection', () => {
  const v = new Validator(
    intersection([
      object(shape({ foo: string() })),
      object(shape({ bar: number() })),
      object(shape({ boo: boolean() })),
    ]),
  )
  it('should pass', () => {
    expect(v.validate({ foo: 'foo', bar: 42, boo: false })).toHaveLength(0)
  })
  it('should fail', () => {
    expect(v.validate(null)).toHaveLength(3)
    expect(v.validate(undefined)).toHaveLength(3)
    expect(v.validate([])).toHaveLength(3)
    expect(v.validate(1)).toHaveLength(3)
    expect(v.validate({ foo: 'foo', bar: 42 })).toHaveLength(1)
    expect(v.validate({ foo: 'foo' })).toHaveLength(2)
  })
})
