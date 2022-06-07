import { OperationObject, RequestBodyObject, ResponseObject } from '@oats-ts/openapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { operationObject } from './validators/operationObject'
import { resolveParameterObject } from './resolveParameterObject'
import { resolveResponseObject } from './resolveResponseObject'
import { resolveRequestBodyObject } from './resolveRequestBodyObject'
import { entries, isNil } from 'lodash'
import { fromArray, isFailure, isSuccess, success, Try } from '@oats-ts/try'

export function resolveOperation(input: ReadInput<OperationObject>, context: ReadContext): Try<OperationObject> {
  const validationResult = validate(input, context, operationObject)
  if (isFailure(validationResult)) {
    return validationResult
  }

  register(input, context)

  const { data, uri } = input
  const { responses, parameters, requestBody } = data ?? {}
  const parts: Try<any>[] = []

  if (!isNil(parameters)) {
    const parametersUri = context.uri.append(uri, 'parameters')
    register({ data: parameters, uri: parametersUri }, context)
    for (let i = 0; i < parameters.length; i += 1) {
      parts.push(
        context.ref.resolveReferenceable(
          { data: parameters[i], uri: context.uri.append(parametersUri, i.toString()) },
          context,
          resolveParameterObject,
        ),
      )
    }
  }

  if (!isNil(responses)) {
    const responsesUri = context.uri.append(uri, 'responses')
    register({ data: responses, uri: responsesUri }, context)
    for (const [name, respOrRef] of entries(responses)) {
      parts.push(
        context.ref.resolveReferenceable<ResponseObject>(
          { data: respOrRef!, uri: context.uri.append(uri, 'responses', name) },
          context,
          resolveResponseObject,
        ),
      )
    }
  }

  if (!isNil(requestBody)) {
    parts.push(
      context.ref.resolveReferenceable<RequestBodyObject>(
        { data: requestBody, uri: context.uri.append(uri, 'requestBody') },
        context,
        resolveRequestBodyObject,
      ),
    )
  }
  const merged = fromArray(parts)
  return isSuccess(merged) ? success(data) : merged
}
