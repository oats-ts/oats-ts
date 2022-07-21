import { configure } from '../configure'
import { enumeration } from './enumeration'

describe('enumeration', () => {
  const v = configure(enumeration<any>(['A', 'B', 'C']))
  it('should only pass for each valid value', () => {
    expect(v('A')).toEqual([])
    expect(v('B')).toEqual([])
    expect(v('C')).toEqual([])
  })
  it('should fail for invalid values', () => {
    expect(v(1)).toHaveLength(1)
    expect(v(NaN)).toHaveLength(1)
    expect(v(null)).toHaveLength(1)
    expect(v('AA')).toHaveLength(1)
    expect(v(['A'])).toHaveLength(1)
    expect(v({ A: true })).toHaveLength(1)
  })
})
