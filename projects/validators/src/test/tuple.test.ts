import { schemas } from '@oats-ts/rules'
import { Validator } from '../Validator'

describe('tuple', () => {
  describe('wrapped in array()', () => {
    const v = new Validator(
      schemas.array(schemas.tuple([schemas.string(), schemas.number(), schemas.optional(schemas.boolean())])),
    )
    it('should pass', () => {
      expect(v.validate(['foo', 12])).toHaveLength(0)
      expect(v.validate(['', 12.54])).toHaveLength(0)
      expect(v.validate(['asd', 0, false])).toHaveLength(0)
      expect(v.validate(['hello world', Number.MAX_SAFE_INTEGER, true])).toHaveLength(0)
    })

    it('should fail', () => {
      expect(v.validate('cat')).toHaveLength(1)
      expect(v.validate(null)).toHaveLength(1)
      expect(v.validate(false)).toHaveLength(1)
      expect(v.validate(1243)).toHaveLength(1)
      expect(v.validate(undefined)).toHaveLength(1)
      expect(v.validate([])).toHaveLength(2)
      expect(v.validate(['', false])).toHaveLength(1)
      expect(v.validate([12, 22])).toHaveLength(1)
      expect(v.validate(['foo'])).toHaveLength(1)
      expect(v.validate([{}])).toHaveLength(2)
    })
  })
  describe('unwrapped', () => {
    const v = new Validator(schemas.tuple([schemas.string(), schemas.number(), schemas.optional(schemas.boolean())]))
    it('should pass', () => {
      expect(v.validate(['foo', 12])).toHaveLength(0)
      expect(v.validate(['', 12.54])).toHaveLength(0)
      expect(v.validate(['asd', 0, false])).toHaveLength(0)
      expect(v.validate(['hello world', Number.MAX_SAFE_INTEGER, true])).toHaveLength(0)
    })

    it('should fail', () => {
      expect(v.validate('cat')).toHaveLength(2)
      expect(v.validate(null)).toHaveLength(2)
      expect(v.validate(false)).toHaveLength(2)
      expect(v.validate(1243)).toHaveLength(2)
      expect(v.validate(undefined)).toHaveLength(2)
    })
  })
})
