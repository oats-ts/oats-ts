import { shape, optional, boolean, number, object, string } from '../factories'
import { Validator } from '../Validator'

describe('shape', () => {
  it('should validate shape', () => {
    const v = new Validator(
      object(
        shape({
          cat: string(),
          foo: number(),
          mayhaps: optional(boolean()),
        }),
      ),
    )
    expect(v.validate({ cat: '', foo: 1 })).toHaveLength(0)
    expect(v.validate({ cat: '', foo: 1, mayhaps: false })).toHaveLength(0)

    expect(v.validate({ cat: '', foo: 1, mayhaps: 'yes' })).toHaveLength(1)
    expect(v.validate({ cat: '', mayhaps: 'yes' })).toHaveLength(2)
    expect(v.validate({})).toHaveLength(2)
  })
})
