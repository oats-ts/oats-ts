import { Issue, literal } from '@oats-ts/validators'
import { ParameterObject } from '@oats-ts/openapi-model'
import { validatorConfig } from '../utils/validatorConfig'
import { paramterObjectArraySchema, parameterObjectObjectSchema, parameterObjectSchema } from './parameterObjectSchema'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { referenceable } from './referenceable'
import { structural } from '../structural'

export function queryParameterObject(
  input: ParameterObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  const uri = context.uriOf(input)
  return ordered(() => structural.queryParameterObject(input, uri, validatorConfig))(() => {
    switch (input.style) {
      case 'form': {
        return referenceable(parameterObjectSchema)(input.schema!, context, config)
      }
      case 'spaceDelimited': {
        return [
          ...literal(true)(input.explode, validatorConfig.append(uri, 'explode'), validatorConfig),
          ...referenceable(paramterObjectArraySchema)(input.schema!, context, config),
        ]
      }
      case 'pipeDelimited': {
        return [
          ...literal(true)(input.explode, validatorConfig.append(uri, 'explode'), validatorConfig),
          ...referenceable(paramterObjectArraySchema)(input.schema!, context, config),
        ]
      }
      case 'deepObject': {
        return [
          ...literal(true)(input.explode, validatorConfig.append(uri, 'explode'), validatorConfig),
          ...referenceable(parameterObjectObjectSchema)(input.schema!, context, config),
        ]
      }
    }
    return []
  })
}
