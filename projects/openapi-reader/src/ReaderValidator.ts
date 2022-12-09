import { URIManipulator } from '@oats-ts/oats-ts'
import { Validator } from '@oats-ts/validators'

export class ReaderValidator extends Validator {
  protected uri: URIManipulator = new URIManipulator()
  protected append(path: string, segment: string | number): string {
    return this.uri.append(path, segment)
  }
}
