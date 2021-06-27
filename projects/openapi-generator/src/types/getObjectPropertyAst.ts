import { ReferenceObject, SchemaObject, isReferenceObject } from 'openapi3-ts'
import { factory, PropertySignature, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { TypesGeneratorConfig } from './typings'
import { documentNode, safeName } from '@oats-ts/typescript-common'

export function getObjectPropertyAst(
  name: string,
  isOptional: boolean,
  data: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
): PropertySignature {
  const node = factory.createPropertySignature(
    undefined,
    safeName(name),
    isOptional ? factory.createToken(SyntaxKind.QuestionToken) : undefined,
    getTypeReferenceAst(data, context, config),
  )
  return config.documentation && !isReferenceObject(data) ? documentNode(node, data) : node
}
