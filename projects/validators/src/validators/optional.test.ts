import { configure } from '../configure'
import { optional } from './optional'
import { string } from './type'

describe('optional', () => {
  it('optional', () => {
    const v = configure(optional(string()))
    expect(v('foo')).toHaveLength(0)
    expect(v(null)).toHaveLength(0)
    expect(v(undefined)).toHaveLength(0)
    expect(v(1)).toHaveLength(1)
    expect(v([])).toHaveLength(1)
    expect(v({})).toHaveLength(1)
  })
})
