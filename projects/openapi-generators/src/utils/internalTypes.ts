import { Referenceable } from '@oats-ts/json-schema-model'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { Expression } from 'typescript'

export type ParameterDescriptorsGenerator = {
  getParameterDescriptorAst(parameters: Referenceable<BaseParameterObject>[]): Expression
}
