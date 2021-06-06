import { DefaultConfig } from '../defaults'
import { fields } from './fields'
import { optional } from './optional'
import { boolean, number, object, string } from './type'

describe('fields', () => {
  const f = {
    cat: string(),
    foo: number(),
    mayhaps: optional(boolean()),
  }

  it('should validate fields', () => {
    const v = object(fields(f))
    expect(v({ cat: '', foo: 1 }, DefaultConfig)).toHaveLength(0)
    expect(v({ cat: '', foo: 1, mayhaps: false }, DefaultConfig)).toHaveLength(0)
    expect(v({ cat: '', foo: 1, mayhaps: false, extra: 'foo' }, DefaultConfig)).toHaveLength(0)

    expect(v({ cat: '', foo: 1, mayhaps: 'yes' }, DefaultConfig)).toHaveLength(1)
    expect(v({ cat: '', mayhaps: 'yes' }, DefaultConfig)).toHaveLength(2)
    expect(v({}, DefaultConfig)).toHaveLength(2)
  })

  // it('should not allow extra fields', () => {
  //   const v = object(fields(f))
  //   expect(v({ cat: '', foo: 1, cat2: false }, DefaultConfig)).toHaveLength(1)
  //   expect(v({ cat: '', foo: 1, mayhaps: false, extra: 'foo' }, DefaultConfig)).toHaveLength(1)
  //   expect(v({ cat: '', foo: 1, extra: 'foo', cat2: false }, DefaultConfig)).toHaveLength(2)
  // })
})
