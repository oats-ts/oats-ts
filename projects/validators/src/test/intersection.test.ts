import { schemas } from '@oats-ts/rules'
import { DefaultValidator } from '../DefaultValidator'

describe('intersection', () => {
  const v = new DefaultValidator(
    schemas.intersection([
      schemas.object(schemas.shape({ foo: schemas.string() })),
      schemas.object(schemas.shape({ bar: schemas.number() })),
      schemas.object(schemas.shape({ boo: schemas.boolean() })),
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
