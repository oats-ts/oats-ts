import {
  array,
  boolean,
  integer,
  intersection,
  items,
  lazy,
  literal,
  minLength,
  nil,
  number,
  optional,
  record,
  restrictKeys,
  shape,
  string,
  tuple,
  union,
} from '../factories'
import { SchemaRule, Severity } from '../typings'
import { Validator } from '../Validator'

class PermissiveValidator extends Validator {
  protected severityOf(schema: SchemaRule, input: unknown, path: string): Severity | undefined {
    return undefined
  }
}

describe('nil', () => {
  const data: [SchemaRule, any][] = [
    [nil(), 'foo'],
    [array(), 'foo'],
    [boolean(), 'foo'],
    [integer(), 'foo'],
    [intersection([string(), number()]), false],
    [items(string()), [1]],
    [lazy(() => string()), 12],
    [literal(13), 12],
    [minLength(2), [12]],
    [optional(string()), 1],
    [record(string(), number()), 1],
    [restrictKeys(['foo']), { bar: 'hi' }],
    [shape({ bar: string() }), { bar: 12 }],
    [tuple([string(), number()]), []],
    [union({ string: string(), number: number() }), false],
  ]

  data.forEach(([schema, input]) => {
    it(`should return 0 issues for ${JSON.stringify(input)} when validating using ${JSON.stringify(schema)}`, () => {
      expect(new PermissiveValidator(schema).validate(input)).toHaveLength(0)
    })
  })
})
