import { OperationObject, RequestBodyObject, ResponseObject } from '@oats-ts/openapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { operationObject } from './validators/operationObject'
import { resolveReferenceable } from './resolveReferenceable'
import { resolveParameterObject } from './resolveParameterObject'
import { resolveResponseObject } from './resolveResponseObject'
import { resolveRequestBodyObject } from './resolveRequestBodyObject'
import { entries, isNil } from 'lodash'

export async function resolveOperation(input: ReadInput<OperationObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, operationObject)) {
    return
  }
  const { data, uri } = input
  const { responses, parameters, requestBody } = data

  if (!isNil(parameters)) {
    const parametersUri = context.uri.append(uri, 'parameters')
    register({ data: parameters, uri: parametersUri }, context)
    for (let i = 0; i < parameters.length; i += 1) {
      await resolveReferenceable(
        { data: parameters[i], uri: context.uri.append(parametersUri, i.toString()) },
        context,
        resolveParameterObject,
      )
    }
  }

  if (!isNil(responses)) {
    const responsesUri = context.uri.append(uri, 'responses')
    register({ data: responses, uri: responsesUri }, context)
    for (const [name, respOrRef] of entries(responses)) {
      await resolveReferenceable<ResponseObject>(
        { data: respOrRef, uri: context.uri.append(uri, 'responses', name) },
        context,
        resolveResponseObject,
      )
    }
  }

  if (!isNil(requestBody)) {
    await resolveReferenceable<RequestBodyObject>(
      { data: requestBody, uri: context.uri.append(uri, 'requestBody') },
      context,
      resolveRequestBodyObject,
    )
  }

  register(input, context)
}
