import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { factory, PropertySignature, SyntaxKind } from 'typescript'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { TypesGeneratorConfig } from './typings'
import { documentNode, safeName } from '@oats-ts/typescript-common'
import { isReferenceObject } from '@oats-ts/model-common'
import { JsonSchemaGeneratorContext } from '../types'

export function getObjectPropertyAst(
  name: string,
  isOptional: boolean,
  data: Referenceable<SchemaObject>,
  context: JsonSchemaGeneratorContext,
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
