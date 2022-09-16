import { OperationObject, ParameterObject } from '@oats-ts/openapi-model'
import { EnhancedOperation, getRequestBodyContent, hasInput } from '@oats-ts/openapi-common'
import {
  Expression,
  TypeNode,
  ImportDeclaration,
  factory,
  SourceFile,
  TypeAliasDeclaration,
  SyntaxKind,
  PropertySignature,
} from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { RuntimeDependency } from '@oats-ts/oats-ts'
import { OperationBasedCodeGenerator } from '../OperationBasedCodeGenerator'
import { entries, flatMap, isNil, negate, values } from 'lodash'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'

export type RequestPropertyName = 'headers' | 'path' | 'query' | 'body' | 'cookies'

export abstract class BaseRequestTypesGenerator<T = {}> extends OperationBasedCodeGenerator<T> {
  protected abstract createRequestProperty(
    name: RequestPropertyName,
    type: TypeNode,
    parameters: ParameterObject[],
    operation: EnhancedOperation,
  ): PropertySignature

  public runtimeDependencies(): RuntimeDependency[] {
    return []
  }

  protected shouldGenerate(operation: EnhancedOperation): boolean {
    return hasInput(operation, this.context)
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, this.name())
    return success(createSourceFile(path, this.getImports(path, data), [this.getRequestTypeAst(data)]))
  }

  public referenceOf(input: OperationObject): TypeNode | Expression | undefined {
    return hasInput(this.enhanced(input), this.context)
      ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasInput(this.enhanced(input), this.context)
      ? getModelImports(fromPath, this.name(), [input], this.context)
      : []
  }

  protected getImports(path: string, data: EnhancedOperation) {
    const bodies = values(getRequestBodyContent(data, this.context))
      .map(({ schema }) => schema)
      .filter(negate(isNil))

    const { operation } = data
    return [
      ...flatMap(bodies, (schema) => this.context.dependenciesOf(path, schema, 'oats/type')),
      ...this.context.dependenciesOf(path, operation, 'oats/path-type'),
      ...this.context.dependenciesOf(path, operation, 'oats/query-type'),
      ...this.context.dependenciesOf(path, operation, 'oats/request-headers-type'),
    ]
  }

  protected getBodyTypeProperties(
    mimeType: string,
    schema: Referenceable<SchemaObject> | undefined,
    operation: EnhancedOperation,
  ): PropertySignature[] {
    const body = this.context.dereference(operation.operation.requestBody)
    return [
      factory.createPropertySignature(
        undefined,
        'mimeType',
        body?.required ? undefined : factory.createToken(SyntaxKind.QuestionToken),
        factory.createLiteralTypeNode(factory.createStringLiteral(mimeType)),
      ),
      this.createRequestProperty('body', this.context.referenceOf(schema, 'oats/type'), [], operation),
    ]
  }

  protected getParameterProperties(data: EnhancedOperation): PropertySignature[] {
    const { header, query, path, cookie, operation } = data

    const props: PropertySignature[] = []

    if (header.length > 0) {
      const typeRef = this.context.referenceOf<TypeNode>(operation, 'oats/request-headers-type')
      props.push(this.createRequestProperty('headers', typeRef, data.header, data))
    }
    if (query.length > 0) {
      const typeRef = this.context.referenceOf<TypeNode>(operation, 'oats/query-type')
      props.push(this.createRequestProperty('query', typeRef, data.query, data))
    }
    if (path.length > 0) {
      const typeRef = this.context.referenceOf<TypeNode>(operation, 'oats/path-type')
      props.push(this.createRequestProperty('path', typeRef, data.path, data))
    }
    if (cookie.length > 0) {
      const typeRef = this.context.referenceOf<TypeNode>(operation, 'oats/cookies-type')
      props.push(this.createRequestProperty('cookies', typeRef, data.cookie, data))
    }

    return props.filter((prop): prop is PropertySignature => !isNil(prop))
  }

  protected getTypeNode(data: EnhancedOperation): TypeNode {
    const bodies = entries(getRequestBodyContent(data, this.context))
    const paramProps = this.getParameterProperties(data)
    switch (bodies.length) {
      case 0: {
        return factory.createTypeLiteralNode(paramProps)
      }
      default: {
        return factory.createUnionTypeNode(
          bodies.map(([mimeType, mediaType]) =>
            factory.createTypeLiteralNode([
              ...paramProps,
              ...this.getBodyTypeProperties(mimeType, mediaType.schema, data),
            ]),
          ),
        )
      }
    }
  }

  protected getRequestTypeAst(data: EnhancedOperation): TypeAliasDeclaration {
    const fullType = this.getTypeNode(data)
    return factory.createTypeAliasDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      this.context.nameOf(data.operation, this.name()),
      undefined,
      fullType,
    )
  }
}
