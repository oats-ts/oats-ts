import { shape } from './shape'
import { optional } from './optional'
import { boolean, number, object, string } from './type'
import { configure } from '../configure'

describe('shape', () => {
  it('should validate shape', () => {
    const v = configure(
      object(
        shape({
          cat: string(),
          foo: number(),
          mayhaps: optional(boolean()),
        }),
      ),
    )
    expect(v({ cat: '', foo: 1 })).toHaveLength(0)
    expect(v({ cat: '', foo: 1, mayhaps: false })).toHaveLength(0)
    expect(v({ cat: '', foo: 1, mayhaps: false, extra: 'foo' })).toHaveLength(1)

    expect(v({ cat: '', foo: 1, mayhaps: 'yes' })).toHaveLength(1)
    expect(v({ cat: '', mayhaps: 'yes' })).toHaveLength(2)
    expect(v({})).toHaveLength(2)
  })
})
