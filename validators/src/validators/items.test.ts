import { items } from './items'
import { array, string } from './type'

describe('items', () => {
  it('items', () => {
    const v = array(items(string()))
    expect(v([])).toHaveLength(0)
    expect(v(['a'])).toHaveLength(0)
    expect(v(['a', 'b'])).toHaveLength(0)

    expect(v([false])).toHaveLength(1)
    expect(v(['a', 1])).toHaveLength(1)
    expect(v(['a', true, {}])).toHaveLength(2)
  })
})
