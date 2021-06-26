import { shape } from './shape'
import { optional } from './optional'
import { boolean, number, object, string } from './type'

describe('shape', () => {
  it('should validate shape', () => {
    const v = object(
      shape({
        cat: string(),
        foo: number(),
        mayhaps: optional(boolean()),
      }),
    )
    expect(v({ cat: '', foo: 1 })).toHaveLength(0)
    expect(v({ cat: '', foo: 1, mayhaps: false })).toHaveLength(0)
    expect(v({ cat: '', foo: 1, mayhaps: false, extra: 'foo' })).toHaveLength(1)

    expect(v({ cat: '', foo: 1, mayhaps: 'yes' })).toHaveLength(1)
    expect(v({ cat: '', mayhaps: 'yes' })).toHaveLength(2)
    expect(v({})).toHaveLength(2)
  })

  it('should not allow extra fields', () => {
    const v = object(
      shape(
        {
          cat: string(),
          foo: number(),
          mayhaps: optional(boolean()),
        },
        true,
      ),
    )
    expect(v({ cat: '', foo: 1, cat2: false })).toHaveLength(0)
    expect(v({ cat: '', foo: 1, mayhaps: false, extra: 'foo' })).toHaveLength(0)
    expect(v({ cat: '', foo: 1, extra: 'foo', cat2: false })).toHaveLength(0)
    expect(v({ cat: 1, foo: 1, extra: 'foo', cat2: false })).toHaveLength(1)
  })
})
