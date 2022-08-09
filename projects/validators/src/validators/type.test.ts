import { configure } from '../configure'
import { string, number, boolean, object, array } from './type'

describe('type', () => {
  it('string', () => {
    const v = configure(string())
    expect(v('cat')).toHaveLength(0)
    expect(v(1)).toHaveLength(1)
    expect(v(null)).toHaveLength(1)
    expect(v(undefined)).toHaveLength(1)
  })
  it('number', () => {
    const v = configure(number())
    expect(v(1)).toHaveLength(0)
    expect(v('cat')).toHaveLength(1)
    expect(v(null)).toHaveLength(1)
    expect(v(undefined)).toHaveLength(1)
  })
  it('boolean', () => {
    const v = configure(boolean())
    expect(v(false)).toHaveLength(0)
    expect(v(true)).toHaveLength(0)
    expect(v('cat')).toHaveLength(1)
    expect(v(null)).toHaveLength(1)
    expect(v(undefined)).toHaveLength(1)
  })
  it('object', () => {
    const v = configure(object())
    expect(v({ foo: 'bar' })).toHaveLength(0)
    expect(v('cat')).toHaveLength(1)
    expect(v(null)).toHaveLength(1)
    expect(v(undefined)).toHaveLength(1)
  })
  it('array', () => {
    const v = configure(array())
    expect(v(['hi'])).toHaveLength(0)
    expect(v({})).toHaveLength(1)
    expect(v('cat')).toHaveLength(1)
    expect(v(null)).toHaveLength(1)
    expect(v(undefined)).toHaveLength(1)
  })
})
