import { schemas, SchemaRule } from '@oats-ts/rules'
import { Severity } from '../typings'
import { DefaultValidator } from '../DefaultValidator'

class PermissiveValidator extends DefaultValidator {
  protected severityOf(schema: SchemaRule, input: unknown, path: string): Severity | undefined {
    return undefined
  }
}

describe('nil', () => {
  const data: [SchemaRule, any][] = [
    [schemas.nil(), 'foo'],
    [schemas.array(), 'foo'],
    [schemas.boolean(), 'foo'],
    [schemas.integer(), 'foo'],
    [schemas.intersection([schemas.string(), schemas.number()]), false],
    [schemas.items(schemas.string()), [1]],
    [schemas.lazy(() => schemas.string()), 12],
    [schemas.literal(13), 12],
    [schemas.minLength(2), [12]],
    [schemas.optional(schemas.string()), 1],
    [schemas.record(schemas.string(), schemas.number()), 1],
    [schemas.restrictKeys(['foo']), { bar: 'hi' }],
    [schemas.shape({ bar: schemas.string() }), { bar: 12 }],
    [schemas.tuple([schemas.string(), schemas.number()]), []],
    [schemas.union({ string: schemas.string(), number: schemas.number() }), false],
  ]

  data.forEach(([schema, input]) => {
    it(`should return 0 issues for ${JSON.stringify(input)} when validating using ${JSON.stringify(schema)}`, () => {
      expect(new PermissiveValidator(schema).validate(input)).toHaveLength(0)
    })
  })
})
