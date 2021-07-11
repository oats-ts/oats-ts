import { Issue } from '../../../validators/lib'
import { OpenAPIValidatorContext } from '../typings'

export const ifNotValidated =
  <T>(context: OpenAPIValidatorContext, item: T) =>
  (validator: () => Issue[]): Issue[] => {
    if (context.validated.has(item)) {
      return []
    }
    context.validated.add(item)
    return validator()
  }
