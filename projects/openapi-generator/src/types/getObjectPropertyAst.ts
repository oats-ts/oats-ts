import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { factory, PropertySignature, SyntaxKind } from 'typescript'
import { documentProperty, getSchemaAndDoc } from '../common/jsDoc'
import { tsIdAst } from '../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { TypesGeneratorConfig } from './typings'

export function getObjectPropertyAst(
  name: string,
  isOptional: boolean,
  data: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
): PropertySignature {
  const [schema] = getSchemaAndDoc(data)
  return documentProperty(
    factory.createPropertySignature(
      undefined,
      tsIdAst(name),
      isOptional ? factory.createToken(SyntaxKind.QuestionToken) : undefined,
      getTypeReferenceAst(schema, context, config),
    ),
    data,
    config,
  )
}
