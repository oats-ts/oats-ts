import {
  Issue,
  object,
  optional,
  shape,
  combine,
  string,
  literal,
  boolean,
  enumeration,
  ShapeInput,
  restrictKeys,
} from '@oats-ts/validators'
import { ParameterObject } from '@oats-ts/openapi-model'
import { validatorConfig } from '../utils/validatorConfig'
import { paramterObjectArraySchema, parameterObjectObjectSchema, parameterObjectSchema } from './parameterObjectSchema'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { referenceable } from './referenceable'

const queryParamShape: ShapeInput<ParameterObject> = {
  name: string(),
  in: literal('query'),
  required: optional(boolean()),
  explode: optional(boolean()),
  description: optional(string()),
  style: optional(enumeration(['form', 'spaceDelimited', 'pipeDelimited', 'deepObject'])),
  schema: object(),
}

const validator = object(combine(shape<ParameterObject>(queryParamShape), restrictKeys(Object.keys(queryParamShape))))

export function queryParameterObject(
  input: ParameterObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  const uri = context.uriOf(input)
  return ordered(() => validator(input, uri, validatorConfig))(() => {
    switch (input.style) {
      case 'form': {
        return referenceable(parameterObjectSchema)(input.schema, context, config)
      }
      case 'spaceDelimited': {
        return [
          ...literal(true)(input.explode, validatorConfig.append(uri, 'explode'), validatorConfig),
          ...referenceable(paramterObjectArraySchema)(input.schema, context, config),
        ]
      }
      case 'pipeDelimited': {
        return [
          ...literal(true)(input.explode, validatorConfig.append(uri, 'explode'), validatorConfig),
          ...referenceable(paramterObjectArraySchema)(input.schema, context, config),
        ]
      }
      case 'deepObject': {
        return [
          ...literal(true)(input.explode, validatorConfig.append(uri, 'explode'), validatorConfig),
          ...referenceable(parameterObjectObjectSchema)(input.schema, context, config),
        ]
      }
    }
    return []
  })
}
