import { OpenAPIObject } from '@oats-ts/openapi-model'
import { Failure, isFailure, isSuccess, Success, Try } from '@oats-ts/try'
import { jsonParse } from './jsonParse'
import { mixedParse } from './mixedParse'
import { yamlParse } from './yamlParse'

describe('parsers', () => {
  const jsonTests = (parser: (uri: string, input: string) => Promise<Try<OpenAPIObject>>) => {
    it('should successfuly parse JSON', async () => {
      const result = await parser('foo', '{"foo": "bar"}')
      expect(isSuccess(result)).toBe(true)
      expect((result as Success<unknown>).data).toEqual({ foo: 'bar' })
    })
    it('should fail to parse non-JSON content', async () => {
      const result = await parser('foo', '"foo\n"')
      expect(isFailure(result)).toBe(true)
      expect((result as Failure).issues).not.toHaveLength(0)
    })
  }

  const yamlTests = (parser: (uri: string, input: string) => Promise<Try<OpenAPIObject>>) => {
    it('should successfuly parse YAML', async () => {
      const result = await parser('foo', 'foo: "bar"')
      expect(isSuccess(result)).toBe(true)
      expect((result as Success<unknown>).data).toEqual({ foo: 'bar' })
    })
    it('should fail to parse non-YAML content', async () => {
      const result = await parser('foo', `"foo: bar`)
      expect(isFailure(result)).toBe(true)
      expect((result as Failure).issues).not.toHaveLength(0)
    })
  }

  describe('JSON', () => {
    jsonTests(jsonParse)
  })
  describe('YAML', () => {
    yamlTests(yamlParse)
  })
  describe('mixed', () => {
    jsonTests(mixedParse)
    yamlTests(mixedParse)
  })
})
