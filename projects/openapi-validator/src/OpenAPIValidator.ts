import { OpenAPIValidatorContext } from './typings'

// TODO
export class OpenAPIValidator {
  private readonly _context: OpenAPIValidatorContext

  public constructor(context: OpenAPIValidatorContext) {
    this._context = context
  }

  protected context(): OpenAPIValidatorContext {
    return this._context
  }
}
