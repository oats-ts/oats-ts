import { DefaultConfig } from '../defaults'
import { string, number, boolean, object, array } from './type'

describe('type', () => {
  it('string', () => {
    const v = string()
    expect(v('cat', DefaultConfig)).toHaveLength(0)
    expect(v(1, DefaultConfig)).toHaveLength(1)
    expect(v(null, DefaultConfig)).toHaveLength(1)
    expect(v(undefined, DefaultConfig)).toHaveLength(1)
  })
  it('number', () => {
    const v = number()
    expect(v(1, DefaultConfig)).toHaveLength(0)
    expect(v('cat', DefaultConfig)).toHaveLength(1)
    expect(v(null, DefaultConfig)).toHaveLength(1)
    expect(v(undefined, DefaultConfig)).toHaveLength(1)
  })
  it('boolean', () => {
    const v = boolean()
    expect(v(false, DefaultConfig)).toHaveLength(0)
    expect(v(true, DefaultConfig)).toHaveLength(0)
    expect(v('cat', DefaultConfig)).toHaveLength(1)
    expect(v(null, DefaultConfig)).toHaveLength(1)
    expect(v(undefined, DefaultConfig)).toHaveLength(1)
  })
  it('object', () => {
    const v = object()
    expect(v({ foo: 'bar' }, DefaultConfig)).toHaveLength(0)
    expect(v('cat', DefaultConfig)).toHaveLength(1)
    expect(v(null, DefaultConfig)).toHaveLength(1)
    expect(v(undefined, DefaultConfig)).toHaveLength(1)
  })
  it('array', () => {
    const v = array()
    expect(v(['hi'], DefaultConfig)).toHaveLength(0)
    expect(v({}, DefaultConfig)).toHaveLength(1)
    expect(v('cat', DefaultConfig)).toHaveLength(1)
    expect(v(null, DefaultConfig)).toHaveLength(1)
    expect(v(undefined, DefaultConfig)).toHaveLength(1)
  })
})
