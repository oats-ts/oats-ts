import { schemas } from '@oats-ts/rules'
import { Validator } from '../Validator'

describe('items', () => {
  describe('wrapped in array()', () => {
    const v = new Validator(schemas.array(schemas.items(schemas.string())))
    it('should pass', () => {
      expect(v.validate([])).toHaveLength(0)
      expect(v.validate(['a'])).toHaveLength(0)
      expect(v.validate(['a', 'b'])).toHaveLength(0)
    })
    it('should fail', () => {
      expect(v.validate(undefined)).toHaveLength(1)
      expect(v.validate([false])).toHaveLength(1)
      expect(v.validate(['a', 1])).toHaveLength(1)
      expect(v.validate(['a', true, {}])).toHaveLength(2)
    })
  })
  describe('unwrapped', () => {
    const v = new Validator(schemas.items(schemas.string()))
    it('should pass', () => {
      expect(v.validate([])).toHaveLength(0)
      expect(v.validate(['a'])).toHaveLength(0)
      expect(v.validate(['a', 'b'])).toHaveLength(0)
      // Should wrap it in array
      expect(v.validate(undefined)).toHaveLength(0)
      expect(v.validate({})).toHaveLength(0)
      expect(v.validate(3)).toHaveLength(0)
    })
    it('should fail', () => {
      expect(v.validate({ length: 10 })).toHaveLength(10)
      expect(v.validate([false])).toHaveLength(1)
      expect(v.validate(['a', 1])).toHaveLength(1)
      expect(v.validate(['a', true, {}])).toHaveLength(2)
    })
  })
})
