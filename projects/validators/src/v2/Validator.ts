import {
  AnySchema,
  ArraySchema,
  BooleanSchema,
  IntegerSchema,
  IntersectionSchema,
  Issue,
  ItemsSchema,
  LazySchema,
  LiteralSchema,
  MinLengthSchema,
  NilSchema,
  NumberSchema,
  ObjectSchema,
  OptionalSchema,
  RecordSchema,
  RestrictKeysSchema,
  Schema,
  Severity,
  ShapeSchema,
  StringSchema,
  TupleSchema,
  UnionSchema,
} from './typings'
import { isNil } from './isNil'

export class Validator<S extends Schema = Schema> {
  constructor(protected readonly schema: S, protected readonly defaultPath: string = '$') {}

  public validate(input: unknown, path: string = this.defaultPath): Issue[] {
    return this.validateBySchema(this.schema, input, path)
  }

  protected validateBySchema(schema: S | Schema, input: unknown, path: string): Issue[] {
    switch (schema.type) {
      case 'any':
        return this.any(schema, input, path)
      case 'array':
        return this.array(schema, input, path)
      case 'boolean':
        return this.boolean(schema, input, path)
      case 'integer':
        return this.integer(schema, input, path)
      case 'intersection':
        return this.intersection(schema, input, path)
      case 'items':
        return this.items(schema, input, path)
      case 'lazy':
        return this.lazy(schema, input, path)
      case 'literal':
        return this.literal(schema, input, path)
      case 'min-length':
        return this.minLength(schema, input, path)
      case 'nil':
        return this.nil(schema, input, path)
      case 'number':
        return this.number(schema, input, path)
      case 'object':
        return this.object(schema, input, path)
      case 'optional':
        return this.optional(schema, input, path)
      case 'record':
        return this.record(schema, input, path)
      case 'restrict-keys':
        return this.restrictKeys(schema, input, path)
      case 'shape':
        return this.shape(schema, input, path)
      case 'string':
        return this.string(schema, input, path)
      case 'tuple':
        return this.tuple(schema, input, path)
      case 'union':
        return this.union(schema, input, path)
      default:
        return []
    }
  }

  protected any(_schema: AnySchema, _input: unknown, _path: string): Issue[] {
    return []
  }

  protected array(schema: ArraySchema, input: unknown, path: string): Issue[] {
    return this.type(schema, input, path, (input) => Array.isArray(input))
  }

  protected boolean(schema: BooleanSchema, input: unknown, path: string): Issue[] {
    return this.type(schema, input, path, (input) => input === true || input === false)
  }

  protected integer(schema: IntegerSchema, input: unknown, path: string): Issue[] {
    return this.type(schema, input, path, (input) => Number.isInteger(input))
  }

  protected intersection(schema: IntersectionSchema, input: unknown, path: string): Issue[] {
    if (isNil(this.severityOf(schema, input, path))) {
      return []
    }
    const issues: Issue[] = []
    for (let i = 0; i < schema.schemas.length; i += 1) {
      issues.push(...this.validateBySchema(schema.schemas[i], input, path))
    }
    return issues
  }

  protected items(schema: ItemsSchema, input: unknown, path: string): Issue[] {
    if (isNil(this.severityOf(schema, input, path))) {
      return []
    }
    const issues: Issue[] = []
    const array = (input as unknown[]) ?? []
    const length = array?.length ?? 0
    for (let i = 0; i < length; i += 1) {
      issues.push(...this.validateBySchema(schema.schema, array?.[i], this.append(path, i)))
    }
    return issues
  }

  protected lazy(schema: LazySchema, input: unknown, path: string): Issue[] {
    if (isNil(this.severityOf(schema, input, path))) {
      return []
    }
    return this.validateBySchema(schema.schema(), input, path)
  }

  protected literal(schema: LiteralSchema, input: unknown, path: string): Issue[] {
    const severity = this.severityOf(schema, input, path)
    if (isNil(severity)) {
      return []
    }
    if (schema.value !== input) {
      return [{ message: this.messageOf(schema, input, path), path, severity }]
    }
    return []
  }

  protected minLength(schema: MinLengthSchema, input: unknown, path: string): Issue[] {
    const severity = this.severityOf(schema, input, path)
    if (isNil(severity)) {
      return []
    }
    if (((input as unknown[])?.length ?? 0) < schema.minLength) {
      return [{ message: this.messageOf(schema, input, path), path, severity }]
    }
    return []
  }

  protected nil(schema: NilSchema, input: unknown, path: string): Issue[] {
    return this.type(schema, input, path, (input) => input === null || input === undefined)
  }

  protected number(schema: NumberSchema, input: unknown, path: string): Issue[] {
    return this.type(schema, input, path, (input) => typeof input === 'number' && !Number.isNaN(input))
  }

  protected object(schema: ObjectSchema, input: unknown, path: string): Issue[] {
    return this.type(
      schema,
      input,
      path,
      (input) => typeof input === 'object' && input !== null && !Array.isArray(input),
    )
  }

  protected optional(schema: OptionalSchema, input: unknown, path: string): Issue[] {
    if (isNil(this.severityOf(schema, input, path))) {
      return []
    }
    if (isNil(input)) {
      return []
    }
    return this.validateBySchema(schema.schema, input, path)
  }

  protected record(schema: RecordSchema, input: unknown, path: string): Issue[] {
    if (isNil(this.severityOf(schema, input, path))) {
      return []
    }
    const issues: Issue[] = []
    const objKeys = Object.keys((input as Record<any, unknown>) ?? {})
    for (let i = 0; i < objKeys.length; i += 1) {
      const key = objKeys[i]
      const item = (input as Record<any, unknown>)?.[key]
      const itemPath = this.append(path, key)
      const keyIssues = this.validateBySchema(schema.keys, key, itemPath)
      const valueIssues = this.validateBySchema(schema.values, item, itemPath)
      issues.push(...keyIssues, ...valueIssues)
    }
    return issues
  }

  protected restrictKeys(schema: RestrictKeysSchema, input: unknown, path: string): Issue[] {
    const severity = this.severityOf(schema, input, path)
    if (isNil(severity)) {
      return []
    }
    const keys = Object.keys((input as Record<any, unknown>) ?? {})
    const extraKeys: string[] = keys.filter((key) => schema.keys.indexOf(key) < 0)
    if (extraKeys.length > 0) {
      return extraKeys.map(
        (key): Issue => ({
          message: this.messageOf(schema, input, path),
          path: this.append(path, key),
          severity,
        }),
      )
    }
    return []
  }

  protected shape(schema: ShapeSchema, input: unknown, path: string): Issue[] {
    if (isNil(this.severityOf(schema, input, path))) {
      return []
    }
    const expectedKeys = Object.keys(schema.shape)
    const issues: Issue[] = []

    for (let i = 0; i < expectedKeys.length; i += 1) {
      const key = expectedKeys[i]
      const item = (input as any)[key]
      const itemShape = schema.shape[key]
      const newIssues = this.validateBySchema(itemShape, item, this.append(path, key))
      issues.push(...newIssues)
    }

    return issues
  }

  protected string(schema: StringSchema, input: unknown, path: string): Issue[] {
    return this.type(schema, input, path, (input) => typeof input === 'string')
  }

  protected tuple(schema: TupleSchema, input: unknown, path: string): Issue[] {
    if (isNil(this.severityOf(schema, input, path))) {
      return []
    }
    const issues: Issue[] = []
    for (let i = 0; i < schema.schemas.length; i += 1) {
      const itemSchema = schema.schemas[i]
      const newIssues = this.validateBySchema(itemSchema, (input as unknown[])?.[i], this.append(path, i))
      issues.push(...newIssues)
    }
    return issues
  }

  protected union(schema: UnionSchema, input: unknown, path: string): Issue[] {
    const severity = this.severityOf(schema, input, path)
    if (isNil(severity)) {
      return []
    }

    const expected = Object.keys(schema.schemas)

    for (let i = 0; i < expected.length; i += 1) {
      const key = expected[i]
      const alternativeSchema = schema.schemas[key]
      const children = this.validateBySchema(alternativeSchema, input, path)
      if (children.length === 0) {
        return []
      }
    }

    return [{ message: this.messageOf(schema, input, path), path: path, severity }]
  }

  protected severityOf(schema: Schema, input: unknown, path: string): Severity | undefined {
    return 'error'
  }

  protected messageOf(schema: Schema, input: unknown, path: string): string {
    switch (schema.type) {
      case 'array': {
        return 'should be an array'
      }
      case 'boolean': {
        return 'should be a boolean'
      }
      case 'nil': {
        return 'should be null or undefined'
      }
      case 'number': {
        return 'should be a number'
      }
      case 'object': {
        return 'should be an object'
      }
      case 'string': {
        return 'should be a string'
      }
      case 'literal': {
        const expected = `should be ${typeof schema.value === 'string' ? `"${schema.value}"` : schema.value}`
        return `should be one of ${expected}`
      }
      case 'min-length': {
        return `length should be at least ${schema.minLength}`
      }
      case 'restrict-keys': {
        return `should not have key`
      }
      case 'union': {
        const expected = Object.keys(schema.schemas).join(', ')
        return `should be one of ${expected}`
      }
      default: {
        return 'unknown issue'
      }
    }
  }

  protected append(path: string, segment: string | number): string {
    if (typeof segment === 'number') {
      return `${path}[${segment}]`
    }
    if (typeof segment === 'string' && /^[$A-Za-z_$][0-9a-zA-Z_$]*$/s.test(segment)) {
      return `${path}.${segment}`
    }
    return `${path}["${segment}"]`
  }

  protected type(
    schema: Schema & { schema?: Schema },
    input: unknown,
    path: string,
    isOfType: (input: unknown) => boolean,
  ): Issue[] {
    const severity = this.severityOf(schema, input, path)
    if (isNil(severity)) {
      return []
    }
    if (!isOfType(input)) {
      return [{ path, message: this.messageOf(schema, input, path), severity }]
    }
    if (isNil(schema.schema)) {
      return []
    }
    return this.validateBySchema(schema.schema, input, path)
  }
}
