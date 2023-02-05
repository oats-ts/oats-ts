import { URIManipulator, URIManipulatorType } from '@oats-ts/oats-ts'
import { SchemaRule } from '@oats-ts/rules'
import { DefaultValidator, Severity } from '@oats-ts/validators'

export class StructuralValidator extends DefaultValidator {
  protected uri: URIManipulatorType = new URIManipulator()
  protected append(path: string, segment: string | number): string {
    return this.uri.append(path, segment)
  }
  protected severityOf(schema: SchemaRule, input: unknown, path: string): Severity | undefined {
    switch (schema.type) {
      case 'restrict-keys':
        return 'info'
      default:
        return super.severityOf(schema, input, path)
    }
  }
  protected messageOf(schema: SchemaRule, input: unknown, path: string): string {
    switch (schema.type) {
      case 'restrict-keys':
        return ''
      default:
        return super.messageOf(schema, input, path)
    }
  }
}
