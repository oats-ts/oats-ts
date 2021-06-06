import { DefaultConfig } from '../defaults'
import { itemsOf } from './itemsOf'
import { array, string } from './type'

describe('itemsOf', () => {
  it('itemsOf', () => {
    const v = array(itemsOf(string()))
    expect(v([], DefaultConfig)).toHaveLength(0)
    expect(v(['a'], DefaultConfig)).toHaveLength(0)
    expect(v(['a', 'b'], DefaultConfig)).toHaveLength(0)

    expect(v([false], DefaultConfig)).toHaveLength(1)
    expect(v(['a', 1], DefaultConfig)).toHaveLength(1)
    expect(v(['a', true, {}], DefaultConfig)).toHaveLength(2)
  })
})
