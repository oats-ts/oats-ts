import { has, isNil, keys, negate } from 'lodash'
import { isReferenceObject, OperationObject, ParameterObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { JSDoc, Node, createPrinter, factory, SyntaxKind, NodeFlags, addSyntheticLeadingComment } from 'typescript'
import { ApiGeneratorConfig } from '../api/typings'
import { OperationsGeneratorConfig } from '../operations/typings'
import { ParameterTypesGeneratorConfig } from '../parameterTypes/typings'
import { TypesGeneratorConfig } from '../types/typings'

function stringifyJsDoc(doc: JSDoc): string {
  const printer = createPrinter()
  const file = factory.createSourceFile([doc as any], factory.createToken(SyntaxKind.EndOfFileToken), NodeFlags.None)
  return printer
    .printFile(file)
    .trim()
    .replace(/^\/\*|\*\/$/g, '')
}

function addJsDocToNode<T extends Node>(node: T, doc: JSDoc): T {
  return addSyntheticLeadingComment(node, SyntaxKind.MultiLineCommentTrivia, stringifyJsDoc(doc), true)
}

export function documentType<T extends Node>(node: T, schema: SchemaObject, config: TypesGeneratorConfig): T {
  if (!config.documentation || (isNil(schema.description) && !schema.deprecated)) {
    return node
  }
  const doc = factory.createJSDocComment(
    schema.description,
    schema.deprecated ? [factory.createJSDocDeprecatedTag(factory.createIdentifier('deprecated'))] : [],
  )
  return addJsDocToNode(node, doc)
}

/** To generate resonable types when the allOf[ref, {description}] format is used, to deal with OpenAPIs BS */
export function getSchemaAndDoc(
  schema: SchemaObject | ReferenceObject,
): [SchemaObject | ReferenceObject, SchemaObject?] {
  if (
    !isReferenceObject(schema) &&
    schema.allOf &&
    schema.allOf.length === 2 &&
    schema.allOf.some(isReferenceObject) &&
    schema.allOf.some((s) => !isReferenceObject(s) && keys(s).length === 1 && has(s, 'description'))
  ) {
    return [schema.allOf.find(isReferenceObject), schema.allOf.find(negate(isReferenceObject))]
  }
  return [schema]
}

export function documentProperty<T extends Node>(
  node: T,
  schema: SchemaObject | ReferenceObject,
  config: TypesGeneratorConfig,
): T {
  if (!config.documentation) {
    return node
  }
  const [s, doc] = getSchemaAndDoc(schema)
  if (!isReferenceObject(s)) {
    return documentType(node, s, config)
  }
  if (!isNil(doc) && (!isNil(doc.description) || doc.deprecated)) {
    return documentType(node, doc, config)
  }
  return node
}

export function documentParameter<T extends Node>(
  node: T,
  schema: ParameterObject,
  config: ParameterTypesGeneratorConfig,
): T {
  if (!config.documentation) {
    return node
  }
  if (!isNil(schema.description)) {
    const doc = factory.createJSDocComment(
      schema.description,
      schema.deprecated ? [factory.createJSDocDeprecatedTag(factory.createIdentifier('deprecated'))] : [],
    )
    return addJsDocToNode(node, doc)
  }
  return node
}

export function documentOperation<T extends Node>(
  node: T,
  schema: OperationObject,
  config: OperationsGeneratorConfig | ApiGeneratorConfig,
): T {
  if (!config.documentation) {
    return node
  }
  if (!isNil(schema.description) || !isNil(schema.summary) || !schema.deprecated) {
    const doc = factory.createJSDocComment(
      [schema.summary, schema.description]
        .filter(negate(isNil))
        .map((doc) => doc.trim())
        .join('\n\n'),
      schema.deprecated ? [factory.createJSDocDeprecatedTag(factory.createIdentifier('deprecated'))] : [],
    )
    return addJsDocToNode(node, doc)
  }
  return node
}
