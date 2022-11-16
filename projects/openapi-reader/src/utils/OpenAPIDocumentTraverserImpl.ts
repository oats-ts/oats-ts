import { DiscriminatorObject, Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import {
  BaseParameterObject,
  ComponentsObject,
  ContentObject,
  HeaderObject,
  MediaTypeObject,
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  PathItemObject,
  PathsObject,
  RequestBodyObject,
  ResponseObject,
} from '@oats-ts/openapi-model'
import { failure, fromArray, isFailure, isSuccess, success, Try } from '@oats-ts/try'
import { DefaultConfig, Validator } from '@oats-ts/validators'
import { entries, isNil } from 'lodash'
import { ReadContext } from '../internalTypings'
import { register } from '../register'
import { structural } from '../structural'
import { OpenAPIDocumentTraverser, ReferenceTraverser } from '../typings'

export class OpenAPIResolverImpl implements OpenAPIDocumentTraverser {
  private readonly _context: ReadContext
  private readonly _refResolver: ReferenceTraverser

  public constructor(context: ReadContext, refResolver: ReferenceTraverser) {
    this._context = context
    this._refResolver = refResolver
  }

  public traverse(data: OpenAPIObject): Try<OpenAPIObject> {
    return this.traverseOpenAPIObject(data, this.context().cache.objectToUri.get(data)!)
  }

  protected referenceTraverser(): ReferenceTraverser {
    return this._refResolver
  }

  protected context(): ReadContext {
    return this._context
  }

  protected register<T>(data: T, uri: string): void {
    register(data, uri, this.context())
  }

  protected registerNamed<T>(name: string, input: Referenceable<T>): void {
    this.context().cache.objectToName.set(input, name)
  }

  protected validate<T>(data: T, uri: string, validator: Validator<any>): Try<void> {
    if (this.context().cache.uriToObject.has(uri)) {
      return success(undefined)
    }
    const issues = validator(data, uri, { ...DefaultConfig, append: this.context().uri.append })
    return issues.length === 0 ? success(undefined) : failure(...issues)
  }

  protected traverseOpenAPIObject(data: OpenAPIObject, uri: string): Try<OpenAPIObject> {
    const validationResult = this.validate(data, uri, structural.openApiObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const { paths, components } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(paths)) {
      parts.push(this.traversePathsObject(paths, this.context().uri.append(uri, 'paths')))
    }
    if (!isNil(components)) {
      parts.push(this.traverseComponentsObject(components, this.context().uri.append(uri, 'components')))
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected traverseComponentsObject(data: ComponentsObject, uri: string): Try<ComponentsObject> {
    const validationResult = this.validate(data, uri, structural.componentsObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const { headers, parameters, responses, requestBodies, schemas } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(schemas)) {
      const schemasUri = this.context().uri.append(uri, 'schemas')
      this.register(schemas, schemasUri)
      for (const [name, schemaOrRef] of entries(schemas)) {
        parts.push(
          this.referenceTraverser().traverseReferenceable<SchemaObject>(
            schemaOrRef,
            this.context().uri.append(schemasUri, name),
            (schema, schemaUri) => this.traverseSchemaObject(schema, schemaUri),
          ),
        )
        this.registerNamed(name, schemaOrRef)
      }
    }

    if (!isNil(parameters)) {
      const parametersUri = this.context().uri.append(uri, 'parameters')
      this.register(parameters, parametersUri)
      for (const [name, paramOrRef] of entries(parameters)) {
        parts.push(
          this.referenceTraverser().traverseReferenceable<ParameterObject>(
            paramOrRef,
            this.context().uri.append(parametersUri, name),
            (param, paramUri) => this.traverseParameterObject(param, paramUri),
          ),
        )
        this.registerNamed(name, paramOrRef)
      }
    }

    if (!isNil(headers)) {
      const headersUri = this.context().uri.append(uri, 'headers')
      this.register(headers, headersUri)
      for (const [name, headerOrRef] of entries(headers)) {
        parts.push(
          this.referenceTraverser().traverseReferenceable<HeaderObject>(
            headerOrRef,
            this.context().uri.append(headersUri, name),
            (header, headerUri) => this.resolveHeaderObject(header, headerUri),
          ),
        )
        this.registerNamed(name, headerOrRef)
      }
    }

    if (!isNil(responses)) {
      const responsesUri = this.context().uri.append(uri, 'responses')
      this.register(responses, responsesUri)
      for (const [name, respOrRef] of entries(responses)) {
        parts.push(
          this.referenceTraverser().traverseReferenceable<ResponseObject>(
            respOrRef,
            this.context().uri.append(responsesUri, name),
            (response, responseUri) => this.traverseResponseObject(response, responseUri),
          ),
        )
        this.registerNamed(name, respOrRef)
      }
    }

    if (!isNil(requestBodies)) {
      const requestBodiesUri = this.context().uri.append(uri, 'requestBodies')
      this.register(requestBodies, requestBodiesUri)
      for (const [name, bodyOrRef] of entries(requestBodies)) {
        parts.push(
          this.referenceTraverser().traverseReferenceable<RequestBodyObject>(
            bodyOrRef,
            this.context().uri.append(requestBodiesUri, name),
            (body, bodyUri) => this.traverseRequestBodyObject(body, bodyUri),
          ),
        )
        this.registerNamed(name, bodyOrRef)
      }
    }
    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected traversePathsObject(data: PathsObject, uri: string): Try<PathsObject> {
    const validationResult = this.validate(data, uri, structural.pathsObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const parts: Try<any>[] = []

    // TODO wtf is $ref on pathItemObject
    for (const [path, pathItem] of entries(data)) {
      parts.push(this.traversePathItemObject(pathItem, this.context().uri.append(uri, path)))
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected traversePathItemObject(data: PathItemObject, uri: string): Try<PathItemObject> {
    const validationResult = this.validate(data, uri, structural.pathItemObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const { get, post, put, delete: _delete, head, patch, options, trace, parameters } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(get)) {
      parts.push(this.traverseOperationObject(get, this.context().uri.append(uri, 'get')))
    }
    if (!isNil(post)) {
      parts.push(this.traverseOperationObject(post, this.context().uri.append(uri, 'post')))
    }
    if (!isNil(put)) {
      parts.push(this.traverseOperationObject(put, this.context().uri.append(uri, 'put')))
    }
    if (!isNil(_delete)) {
      parts.push(this.traverseOperationObject(_delete, this.context().uri.append(uri, 'delete')))
    }
    if (!isNil(head)) {
      parts.push(this.traverseOperationObject(head, this.context().uri.append(uri, 'head')))
    }
    if (!isNil(patch)) {
      parts.push(this.traverseOperationObject(patch, this.context().uri.append(uri, 'patch')))
    }
    if (!isNil(options)) {
      parts.push(this.traverseOperationObject(options, this.context().uri.append(uri, 'options')))
    }
    if (!isNil(trace)) {
      parts.push(this.traverseOperationObject(trace, this.context().uri.append(uri, 'trace')))
    }
    if (!isNil(parameters)) {
      const parametersUri = this.context().uri.append(uri, 'parameters')
      this.register(parameters, parametersUri)
      for (const [name, paramOrRef] of entries(parameters)) {
        parts.push(
          this.referenceTraverser().traverseReferenceable<ParameterObject>(
            paramOrRef,
            this.context().uri.append(parametersUri, name),
            (param, paramUri) => this.traverseParameterObject(param, paramUri),
          ),
        )
      }
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected traverseOperationObject(data: OperationObject, uri: string): Try<OperationObject> {
    const validationResult = this.validate(data, uri, structural.operationObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const { responses, parameters, requestBody } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(parameters)) {
      const parametersUri = this.context().uri.append(uri, 'parameters')
      this.register(parameters, parametersUri)
      for (let i = 0; i < parameters.length; i += 1) {
        parts.push(
          this.referenceTraverser().traverseReferenceable(
            parameters[i],
            this.context().uri.append(parametersUri, i.toString()),
            (param, paramUri) => this.traverseParameterObject(param, paramUri),
          ),
        )
      }
    }

    if (!isNil(responses)) {
      const responsesUri = this.context().uri.append(uri, 'responses')
      this.register(responses, responsesUri)
      for (const [name, respOrRef] of entries(responses)) {
        parts.push(
          this.referenceTraverser().traverseReferenceable<ResponseObject>(
            respOrRef!,
            this.context().uri.append(uri, 'responses', name),
            (response, responseUri) => this.traverseResponseObject(response, responseUri),
          ),
        )
      }
    }

    if (!isNil(requestBody)) {
      parts.push(
        this.referenceTraverser().traverseReferenceable<RequestBodyObject>(
          requestBody,
          this.context().uri.append(uri, 'requestBody'),
          (body, bodyUri) => this.traverseRequestBodyObject(body, bodyUri),
        ),
      )
    }
    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected traverseBaseParameter<T extends BaseParameterObject>(
    validator: Validator<any>,
    data: T,
    uri: string,
  ): Try<T> {
    const validationResult = this.validate(data, uri, validator)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const { content, schema } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(schema)) {
      parts.push(
        this.referenceTraverser().traverseReferenceable(
          schema,
          this.context().uri.append(uri, 'schema'),
          (schema, schemaUri) => this.traverseSchemaObject(schema, schemaUri),
        ),
      )
    }

    if (!isNil(content)) {
      for (const [key, mediaTypeObject] of entries(content)) {
        parts.push(this.traverseMediaTypeObject(mediaTypeObject, this.context().uri.append(uri, 'content', key)))
      }
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected traverseParameterObject(data: ParameterObject, uri: string): Try<ParameterObject> {
    return this.traverseBaseParameter(structural.parameterObject, data, uri)
  }

  protected resolveHeaderObject(data: HeaderObject, uri: string): Try<HeaderObject> {
    return this.traverseBaseParameter(structural.headerObject, data, uri)
  }

  protected traverseMediaTypeObject(data: MediaTypeObject, uri: string): Try<MediaTypeObject> {
    const validationResult = this.validate(data, uri, structural.mediaTypeObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const { schema, encoding } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(schema)) {
      parts.push(
        this.referenceTraverser().traverseReferenceable(
          schema,
          this.context().uri.append(uri, 'schema'),
          (schema, schemaUri) => this.traverseSchemaObject(schema, schemaUri),
        ),
      )
    }

    if (!isNil(encoding)) {
      // TODO not dealing with this mess for now...
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected traverseSchemaObject(data: SchemaObject, uri: string): Try<SchemaObject> {
    const validationResult = this.validate(data, uri, structural.schemaObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const { items, not, allOf, oneOf, anyOf, properties, additionalProperties, discriminator, prefixItems } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(items) && typeof items !== 'boolean') {
      parts.push(
        this.referenceTraverser().traverseReferenceable(
          items,
          this.context().uri.append(uri, 'items'),
          (items, itemsUri) => this.traverseSchemaObject(items, itemsUri),
        ),
      )
    }

    if (!isNil(not)) {
      parts.push(
        this.referenceTraverser().traverseReferenceable(not, this.context().uri.append(uri, 'not'), (not, notUri) =>
          this.traverseSchemaObject(not, notUri),
        ),
      )
    }

    if (!isNil(discriminator)) {
      parts.push(this.traverseDiscriminatorObject(discriminator, this.context().uri.append(uri, 'discriminator')))
    }

    if (!isNil(additionalProperties) && typeof additionalProperties !== 'boolean') {
      parts.push(
        this.referenceTraverser().traverseReferenceable(
          additionalProperties,
          this.context().uri.append(uri, 'additionalProperties'),
          (addProps, addPropsUri) => this.traverseSchemaObject(addProps, addPropsUri),
        ),
      )
    }

    if (!isNil(allOf)) {
      const allOfUri = this.context().uri.append(uri, 'allOf')
      this.register(allOf, allOfUri)
      for (let i = 0; i < allOf.length; i += 1) {
        parts.push(
          this.referenceTraverser().traverseReferenceable(
            allOf[i],
            this.context().uri.append(allOfUri, i.toString()),
            (allOfSchema, allOfSchemaUri) => this.traverseSchemaObject(allOfSchema, allOfSchemaUri),
          ),
        )
      }
    }

    if (!isNil(oneOf)) {
      const oneOfUri = this.context().uri.append(uri, 'oneOf')
      this.register(oneOf, oneOfUri)
      for (let i = 0; i < oneOf.length; i += 1) {
        parts.push(
          this.referenceTraverser().traverseReferenceable(
            oneOf[i],
            this.context().uri.append(oneOfUri, i.toString()),
            (oneOfSchema, oneOfSchemaUri) => this.traverseSchemaObject(oneOfSchema, oneOfSchemaUri),
          ),
        )
      }
    }

    if (!isNil(anyOf)) {
      const anyOfUri = this.context().uri.append(uri, 'anyOf')
      this.register(anyOf, anyOfUri)
      for (let i = 0; i < anyOf.length; i += 1) {
        parts.push(
          this.referenceTraverser().traverseReferenceable(
            anyOf[i],
            this.context().uri.append(anyOfUri, i.toString()),
            (anyOfSchema, anyOfSchemaUri) => this.traverseSchemaObject(anyOfSchema, anyOfSchemaUri),
          ),
        )
      }
    }

    if (!isNil(properties)) {
      const propertiesUri = this.context().uri.append(uri, 'properties')
      this.register(properties, propertiesUri)
      for (const [name, propSchema] of entries(properties)) {
        parts.push(
          this.referenceTraverser().traverseReferenceable(
            propSchema,
            this.context().uri.append(propertiesUri, name),
            (propsSchema, propsSchemaUri) => this.traverseSchemaObject(propsSchema, propsSchemaUri),
          ),
        )
      }
    }

    if (!isNil(prefixItems)) {
      const prefixItemsUri = this.context().uri.append(uri, 'prefixItems')
      for (let i = 0; i < prefixItems.length; i += 1) {
        parts.push(
          this.referenceTraverser().traverseReferenceable(
            prefixItems[i],
            this.context().uri.append(prefixItemsUri, i.toString()),
            (item, itemUri) => this.traverseSchemaObject(item, itemUri),
          ),
        )
      }
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected traverseDiscriminatorObject(data: DiscriminatorObject, uri: string): Try<DiscriminatorObject> {
    const validationResult = this.validate(data, uri, structural.discriminatorObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const { mapping } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(mapping)) {
      for (const [key, ref] of entries(mapping)) {
        const refInput = this.referenceTraverser().traverseReference(
          ref,
          this.context().uri.append(uri, 'mapping', key),
        )
        parts.push(refInput)
        if (isSuccess(refInput)) {
          mapping[key] = refInput.data
        }
      }
    }
    return success(data)
  }

  protected traverseResponseObject(data: ResponseObject, uri: string): Try<ResponseObject> {
    const validationResult = this.validate(data, uri, structural.responseObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const { content, headers } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(headers)) {
      const headersUri = this.context().uri.append(uri, 'headers')
      this.register(headers, headersUri)

      for (const [name, headerOrRef] of entries(headers)) {
        parts.push(
          this.referenceTraverser().traverseReferenceable<HeaderObject>(
            headerOrRef,
            this.context().uri.append(headersUri, name),
            (header, headerUri) => this.resolveHeaderObject(header, headerUri),
          ),
        )
        this.registerNamed(name, headerOrRef)
      }
    }

    if (!isNil(content)) {
      parts.push(this.traverseContentObject(content, this.context().uri.append(uri, 'content')))
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected traverseRequestBodyObject(data: RequestBodyObject, uri: string): Try<RequestBodyObject> {
    const validationResult = this.validate(data, uri, structural.requestBodyObject)
    if (isFailure(validationResult)) {
      return validationResult
    }
    this.register(data, uri)

    const { content } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(content)) {
      parts.push(this.traverseContentObject(content, this.context().uri.append(uri, 'content')))
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected traverseContentObject(data: ContentObject, uri: string): Try<ContentObject> {
    const validationResult = this.validate(data, uri, structural.contentObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const parts: Try<any>[] = []

    for (const [name, mediaTypeObj] of entries(data)) {
      parts.push(this.traverseMediaTypeObject(mediaTypeObj, this.context().uri.append(uri, name)))
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data!) : merged
  }
}
