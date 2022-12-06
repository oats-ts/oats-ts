import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { isReferenceObject, isReferenceTarget } from '@oats-ts/model-common'
import {
  ComponentsObject,
  ContentObject,
  HeaderObject,
  MediaTypeObject,
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  PathItemObject,
  RequestBodyObject,
  ResponseObject,
} from '@oats-ts/openapi-model'
import { isNil, values } from 'lodash'
import { OpenAPIVisitor } from './typings'

export class OpenAPITraverser<I> {
  constructor(public readonly input: I, private readonly visitor: Partial<OpenAPIVisitor<I>>) {}
  traverseOpenAPIObject(data: OpenAPIObject): void {
    if (!(this.visitor?.visitOpenAPIObject?.(data, this.input) ?? true)) {
      return
    }
    if (!isNil(data.paths)) {
      values(data.paths).forEach((pathItem) => this.traversePathItemObject(pathItem))
    }
    if (!isNil(data.components)) {
      this.traverseComponentsObject(data.components)
    }
  }
  traverseComponentsObject(data: ComponentsObject): void {
    if (!(this.visitor?.visitComponentsObject?.(data, this.input) ?? true)) {
      return
    }
    if (!isNil(data.headers)) {
      values(data.headers).forEach((header) =>
        isReferenceObject(header) ? this.traverseReferenceObject(header) : this.traverseHeaderObject(header),
      )
    }
    if (!isNil(data.parameters)) {
      values(data.parameters).forEach((param) =>
        isReferenceObject(param) ? this.traverseReferenceObject(param) : this.traverseParameterObject(param),
      )
    }
    if (!isNil(data.requestBodies)) {
      values(data.requestBodies).forEach((body) =>
        isReferenceObject(body) ? this.traverseReferenceObject(body) : this.traverseRequestBodyObject(body),
      )
    }
    if (!isNil(data.responses)) {
      values(data.responses).forEach((resp) =>
        isReferenceObject(resp) ? this.traverseReferenceObject(resp) : this.traverseResponseObject(resp),
      )
    }
    if (!isNil(data.schemas)) {
      values(data.schemas).forEach((schema) => this.traverseReferenceableSchema(schema))
    }
  }
  traversePathItemObject(data: PathItemObject): void {
    if (!(this.visitor?.visitPathItemObject?.(data, this.input) ?? true)) {
      return
    }
    const operations = [data.delete, data.get, data.head, data.options, data.patch, data.post, data.put].filter(
      (operation): operation is OperationObject => !isNil(operation),
    )
    operations.forEach((operation) => this.traverseOperationObject(operation))

    if (!isNil(data.parameters)) {
      data.parameters.filter(isReferenceTarget).forEach((param) => this.traverseParameterObject(param))
    }
  }
  traverseOperationObject(data: OperationObject): void {
    if (!(this.visitor?.visitOperationObject?.(data, this.input) ?? true)) {
      return
    }
    if (!isNil(data.parameters)) {
      data.parameters.filter(isReferenceTarget).forEach((param) => this.traverseParameterObject(param))
    }
    if (!isNil(data.requestBody)) {
      if (isReferenceObject(data.requestBody)) {
        this.traverseReferenceObject(data.requestBody)
      } else {
        this.traverseRequestBodyObject(data.requestBody)
      }
    }
    if (!isNil(data.responses)) {
      values(data.responses)
        .filter((resp): resp is Referenceable<ResponseObject> => !isNil(resp))
        .forEach((resp) =>
          isReferenceObject(resp) ? this.traverseReferenceObject(resp) : this.traverseResponseObject(resp),
        )
    }
  }
  traverseResponseObject(data: ResponseObject): void {
    if (!(this.visitor?.visitResponseObject?.(data, this.input) ?? true)) {
      return
    }
    if (!isNil(data.content)) {
      this.traverseContentObject(data.content)
    }
    if (!isNil(data.headers)) {
      values(data.headers).forEach((header) =>
        isReferenceObject(header) ? this.traverseReferenceObject(header) : this.traverseHeaderObject(header),
      )
    }
  }
  traverseParameterObject(data: ParameterObject): void {
    if (!(this.visitor?.visitParameterObject?.(data, this.input) ?? true)) {
      return
    }
    if (!isNil(data.schema)) {
      this.traverseReferenceableSchema(data.schema)
    }
  }
  traverseRequestBodyObject(data: RequestBodyObject): void {
    if (!(this.visitor?.visitRequestBodyObject?.(data, this.input) ?? true)) {
      return
    }
    if (!isNil(data.content)) {
      this.traverseContentObject(data.content)
    }
  }
  traverseContentObject(data: ContentObject): void {
    if (!(this.visitor?.visitContentObject?.(data, this.input) ?? true)) {
      return
    }

    values(data).forEach((mediaTypeObj) => this.traverseMediaTypeObject(mediaTypeObj))
  }
  traverseMediaTypeObject(data: MediaTypeObject): void {
    if (!(this.visitor?.visitMediaTypeObject?.(data, this.input) ?? true)) {
      return
    }
    if (!isNil(data.schema)) {
      this.traverseReferenceableSchema(data.schema)
    }
  }
  traverseHeaderObject(data: HeaderObject): void {
    if (!(this.visitor?.visitHeaderObject?.(data, this.input) ?? true)) {
      return
    }
    if (!isNil(data.schema)) {
      this.traverseReferenceableSchema(data.schema)
    }
  }
  traverseSchemaObject(data: SchemaObject): void {
    if (!(this.visitor?.visitSchemaObject?.(data, this.input) ?? true)) {
      return
    }

    const schemas = [
      ...values(data.additionalProperties ?? {}),
      ...(data.allOf ?? []),
      ...(data.anyOf ?? []),
      typeof data.items !== 'boolean' ? data.items : undefined,
      ...(data.oneOf ?? []),
      ...values(data.properties ?? {}),
      ...(data.prefixItems ?? []),
    ]

    schemas
      .filter((schema): schema is Referenceable<SchemaObject> => !isNil(schema))
      .forEach((schema) => this.traverseReferenceableSchema(schema))
  }
  traverseReferenceObject(data: ReferenceObject): void {
    this.visitor?.visitReferenceObject?.(data, this.input)
  }

  protected traverseReferenceableSchema(data: Referenceable<SchemaObject>): void {
    if (isReferenceObject(data)) {
      this.traverseReferenceObject(data)
    } else {
      this.traverseSchemaObject(data)
    }
  }
}
