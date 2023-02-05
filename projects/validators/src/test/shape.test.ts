import { schemas } from '@oats-ts/rules'
import { DefaultValidator } from '../DefaultValidator'

describe('shape', () => {
  it('should validate shape', () => {
    const v = new DefaultValidator(
      schemas.object(
        schemas.shape({
          cat: schemas.string(),
          foo: schemas.number(),
          mayhaps: schemas.optional(schemas.boolean()),
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
