import { DefaultConfig } from '../defaults'
import { optional } from './optional'
import { string } from './type'

describe('optional', () => {
  it('optional', () => {
    const v = optional(string())
    expect(v('foo', DefaultConfig)).toHaveLength(0)
    expect(v(null, DefaultConfig)).toHaveLength(0)
    expect(v(undefined, DefaultConfig)).toHaveLength(0)
    expect(v(1, DefaultConfig)).toHaveLength(1)
    expect(v([], DefaultConfig)).toHaveLength(1)
    expect(v({}, DefaultConfig)).toHaveLength(1)
  })
})
