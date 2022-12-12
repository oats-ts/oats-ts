import { Referenceable } from '@oats-ts/json-schema-model'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { Expression, ImportDeclaration, TypeReferenceNode } from 'typescript'

export type ParameterDescriptorsGenerator = {
  getParameterDescriptorAst(parameters: Referenceable<BaseParameterObject>[]): Expression
  getValidatorSchemaAst(parameters: Referenceable<BaseParameterObject>[]): Expression
  getValidatorImports(path: string, parameters: Referenceable<BaseParameterObject>[]): ImportDeclaration[]
  getParametersTypeAst<T>(input: T): TypeReferenceNode
  getModelTargetType(): OpenAPIGeneratorTarget
  getImports<T>(path: string, input: T, parameters: Referenceable<BaseParameterObject>[]): ImportDeclaration[]
}
