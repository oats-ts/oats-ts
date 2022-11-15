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
import { ReadContext } from './internalTypings'
import { structural } from './structural'
import { OpenAPIResolver, ReferenceResolver2 } from './typings'

export class OpenAPIResolverImpl implements OpenAPIResolver {
  private readonly _context: ReadContext
  private readonly _refResolver: ReferenceResolver2

  public constructor(context: ReadContext, resolver: ReferenceResolver2) {
    this._context = context
    this._refResolver = resolver
  }

  public resolve(data: OpenAPIObject): Try<OpenAPIObject> {
    return this.resolveOpenAPIObject(data, this.context().cache.objectToUri.get(data)!)
  }

  protected resolver(): ReferenceResolver2 {
    return this._refResolver
  }

  protected context(): ReadContext {
    return this._context
  }

  protected register<T>(data: T, uri: string): void {
    this.context().cache.uriToObject.set(uri, data)
    this.context().cache.objectToUri.set(data, uri)
    this.context().cache.objectToHash.set(data, this.hash(JSON.stringify(data)))
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

  /**
   * Appropriated from this repo, as it's archived and unmaintained:
   * https://github.com/darkskyapp/string-hash/blob/master/index.js
   */
  protected hash(input: string): number {
    let hash = 5381
    for (let i = 0; i < input.length; i += 1) {
      hash = (hash * 33) ^ input.charCodeAt(i)
    }
    return hash >>> 0
  }

  protected resolveOpenAPIObject(data: OpenAPIObject, uri: string): Try<OpenAPIObject> {
    const validationResult = this.validate(data, uri, structural.openApiObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const { paths, components } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(paths)) {
      parts.push(this.resolvePathsObject(paths, this.context().uri.append(uri, 'paths')))
    }
    if (!isNil(components)) {
      parts.push(this.resolveComponentsObject(components, this.context().uri.append(uri, 'components')))
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected resolveComponentsObject(data: ComponentsObject, uri: string): Try<ComponentsObject> {
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
          this.resolver().resolveReferenceable<SchemaObject>(
            schemaOrRef,
            this.context().uri.append(schemasUri, name),
            (schema, schemaUri) => this.resolveSchemaObject(schema, schemaUri),
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
          this.resolver().resolveReferenceable<ParameterObject>(
            paramOrRef,
            this.context().uri.append(parametersUri, name),
            (param, paramUri) => this.resolveParameterObject(param, paramUri),
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
          this.resolver().resolveReferenceable<HeaderObject>(
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
          this.resolver().resolveReferenceable<ResponseObject>(
            respOrRef,
            this.context().uri.append(responsesUri, name),
            (response, responseUri) => this.resolveResponseObject(response, responseUri),
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
          this.resolver().resolveReferenceable<RequestBodyObject>(
            bodyOrRef,
            this.context().uri.append(requestBodiesUri, name),
            (body, bodyUri) => this.resolveRequestBodyObject(body, bodyUri),
          ),
        )
        this.registerNamed(name, bodyOrRef)
      }
    }
    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected resolvePathsObject(data: PathsObject, uri: string): Try<PathsObject> {
    const validationResult = this.validate(data, uri, structural.pathsObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const parts: Try<any>[] = []

    // TODO wtf is $ref on pathItemObject
    for (const [path, pathItem] of entries(data)) {
      parts.push(this.resolvePathItemObject(pathItem, this.context().uri.append(uri, path)))
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected resolvePathItemObject(data: PathItemObject, uri: string): Try<PathItemObject> {
    const validationResult = this.validate(data, uri, structural.pathItemObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const { get, post, put, delete: _delete, head, patch, options, trace, parameters } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(get)) {
      parts.push(this.resolveOperationObject(get, this.context().uri.append(uri, 'get')))
    }
    if (!isNil(post)) {
      parts.push(this.resolveOperationObject(post, this.context().uri.append(uri, 'post')))
    }
    if (!isNil(put)) {
      parts.push(this.resolveOperationObject(put, this.context().uri.append(uri, 'put')))
    }
    if (!isNil(_delete)) {
      parts.push(this.resolveOperationObject(_delete, this.context().uri.append(uri, 'delete')))
    }
    if (!isNil(head)) {
      parts.push(this.resolveOperationObject(head, this.context().uri.append(uri, 'head')))
    }
    if (!isNil(patch)) {
      parts.push(this.resolveOperationObject(patch, this.context().uri.append(uri, 'patch')))
    }
    if (!isNil(options)) {
      parts.push(this.resolveOperationObject(options, this.context().uri.append(uri, 'options')))
    }
    if (!isNil(trace)) {
      parts.push(this.resolveOperationObject(trace, this.context().uri.append(uri, 'trace')))
    }
    if (!isNil(parameters)) {
      const parametersUri = this.context().uri.append(uri, 'parameters')
      this.register(parameters, parametersUri)
      for (const [name, paramOrRef] of entries(parameters)) {
        parts.push(
          this.resolver().resolveReferenceable<ParameterObject>(
            paramOrRef,
            this.context().uri.append(parametersUri, name),
            (param, paramUri) => this.resolveParameterObject(param, paramUri),
          ),
        )
      }
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected resolveOperationObject(data: OperationObject, uri: string): Try<OperationObject> {
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
          this.resolver().resolveReferenceable(
            parameters[i],
            this.context().uri.append(parametersUri, i.toString()),
            (param, paramUri) => this.resolveParameterObject(param, paramUri),
          ),
        )
      }
    }

    if (!isNil(responses)) {
      const responsesUri = this.context().uri.append(uri, 'responses')
      this.register(responses, responsesUri)
      for (const [name, respOrRef] of entries(responses)) {
        parts.push(
          this.resolver().resolveReferenceable<ResponseObject>(
            respOrRef!,
            this.context().uri.append(uri, 'responses', name),
            (response, responseUri) => this.resolveResponseObject(response, responseUri),
          ),
        )
      }
    }

    if (!isNil(requestBody)) {
      parts.push(
        this.resolver().resolveReferenceable<RequestBodyObject>(
          requestBody,
          this.context().uri.append(uri, 'requestBody'),
          (body, bodyUri) => this.resolveRequestBodyObject(body, bodyUri),
        ),
      )
    }
    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected resolveBaseParameter<T extends BaseParameterObject>(
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
        this.resolver().resolveReferenceable(schema, this.context().uri.append(uri, 'schema'), (schema, schemaUri) =>
          this.resolveSchemaObject(schema, schemaUri),
        ),
      )
    }

    if (!isNil(content)) {
      for (const [key, mediaTypeObject] of entries(content)) {
        parts.push(this.resolveMediaTypeObject(mediaTypeObject, this.context().uri.append(uri, 'content', key)))
      }
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected resolveParameterObject(data: ParameterObject, uri: string): Try<ParameterObject> {
    return this.resolveBaseParameter(structural.parameterObject, data, uri)
  }

  protected resolveHeaderObject(data: HeaderObject, uri: string): Try<HeaderObject> {
    return this.resolveBaseParameter(structural.headerObject, data, uri)
  }

  protected resolveMediaTypeObject(data: MediaTypeObject, uri: string): Try<MediaTypeObject> {
    const validationResult = this.validate(data, uri, structural.mediaTypeObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const { schema, encoding } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(schema)) {
      parts.push(
        this.resolver().resolveReferenceable(schema, this.context().uri.append(uri, 'schema'), (schema, schemaUri) =>
          this.resolveSchemaObject(schema, schemaUri),
        ),
      )
    }

    if (!isNil(encoding)) {
      // TODO not dealing with this mess for now...
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected resolveSchemaObject(data: SchemaObject, uri: string): Try<SchemaObject> {
    const validationResult = this.validate(data, uri, structural.schemaObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const { items, not, allOf, oneOf, anyOf, properties, additionalProperties, discriminator, prefixItems } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(items) && typeof items !== 'boolean') {
      parts.push(
        this.resolver().resolveReferenceable(items, this.context().uri.append(uri, 'items'), (items, itemsUri) =>
          this.resolveSchemaObject(items, itemsUri),
        ),
      )
    }

    if (!isNil(not)) {
      parts.push(
        this.resolver().resolveReferenceable(not, this.context().uri.append(uri, 'not'), (not, notUri) =>
          this.resolveSchemaObject(not, notUri),
        ),
      )
    }

    if (!isNil(discriminator)) {
      parts.push(this.resolveDiscriminatorObject(discriminator, this.context().uri.append(uri, 'discriminator')))
    }

    if (!isNil(additionalProperties) && typeof additionalProperties !== 'boolean') {
      parts.push(
        this.resolver().resolveReferenceable(
          additionalProperties,
          this.context().uri.append(uri, 'additionalProperties'),
          (addProps, addPropsUri) => this.resolveSchemaObject(addProps, addPropsUri),
        ),
      )
    }

    if (!isNil(allOf)) {
      const allOfUri = this.context().uri.append(uri, 'allOf')
      this.register(allOf, allOfUri)
      for (let i = 0; i < allOf.length; i += 1) {
        parts.push(
          this.resolver().resolveReferenceable(
            allOf[i],
            this.context().uri.append(allOfUri, i.toString()),
            (allOfSchema, allOfSchemaUri) => this.resolveSchemaObject(allOfSchema, allOfSchemaUri),
          ),
        )
      }
    }

    if (!isNil(oneOf)) {
      const oneOfUri = this.context().uri.append(uri, 'oneOf')
      this.register(oneOf, oneOfUri)
      for (let i = 0; i < oneOf.length; i += 1) {
        parts.push(
          this.resolver().resolveReferenceable(
            oneOf[i],
            this.context().uri.append(oneOfUri, i.toString()),
            (oneOfSchema, oneOfSchemaUri) => this.resolveSchemaObject(oneOfSchema, oneOfSchemaUri),
          ),
        )
      }
    }

    if (!isNil(anyOf)) {
      const anyOfUri = this.context().uri.append(uri, 'anyOf')
      this.register(anyOf, anyOfUri)
      for (let i = 0; i < anyOf.length; i += 1) {
        parts.push(
          this.resolver().resolveReferenceable(
            anyOf[i],
            this.context().uri.append(anyOfUri, i.toString()),
            (anyOfSchema, anyOfSchemaUri) => this.resolveSchemaObject(anyOfSchema, anyOfSchemaUri),
          ),
        )
      }
    }

    if (!isNil(properties)) {
      const propertiesUri = this.context().uri.append(uri, 'properties')
      this.register(properties, propertiesUri)
      for (const [name, propSchema] of entries(properties)) {
        parts.push(
          this.resolver().resolveReferenceable(
            propSchema,
            this.context().uri.append(propertiesUri, name),
            (propsSchema, propsSchemaUri) => this.resolveSchemaObject(propsSchema, propsSchemaUri),
          ),
        )
      }
    }

    if (!isNil(prefixItems)) {
      const prefixItemsUri = this.context().uri.append(uri, 'prefixItems')
      for (let i = 0; i < prefixItems.length; i += 1) {
        parts.push(
          this.resolver().resolveReferenceable(
            prefixItems[i],
            this.context().uri.append(prefixItemsUri, i.toString()),
            (item, itemUri) => this.resolveSchemaObject(item, itemUri),
          ),
        )
      }
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected resolveDiscriminatorObject(data: DiscriminatorObject, uri: string): Try<DiscriminatorObject> {
    const validationResult = this.validate(data, uri, structural.discriminatorObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const { mapping } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(mapping)) {
      for (const [key, ref] of entries(mapping)) {
        const refInput = this.resolver().resolveReferenceUri(ref, this.context().uri.append(uri, 'mapping', key))
        parts.push(refInput)
        if (isSuccess(refInput)) {
          mapping[key] = refInput.data
        }
      }
    }
    return success(data)
  }

  protected resolveResponseObject(data: ResponseObject, uri: string): Try<ResponseObject> {
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
          this.resolver().resolveReferenceable<HeaderObject>(
            headerOrRef,
            this.context().uri.append(headersUri, name),
            (header, headerUri) => this.resolveHeaderObject(header, headerUri),
          ),
        )
        this.registerNamed(name, headerOrRef)
      }
    }

    if (!isNil(content)) {
      parts.push(this.resolveContentObject(content, this.context().uri.append(uri, 'content')))
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected resolveRequestBodyObject(data: RequestBodyObject, uri: string): Try<RequestBodyObject> {
    const validationResult = this.validate(data, uri, structural.requestBodyObject)
    if (isFailure(validationResult)) {
      return validationResult
    }
    this.register(data, uri)

    const { content } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(content)) {
      parts.push(this.resolveContentObject(content, this.context().uri.append(uri, 'content')))
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

  protected resolveContentObject(data: ContentObject, uri: string): Try<ContentObject> {
    const validationResult = this.validate(data, uri, structural.contentObject)
    if (isFailure(validationResult)) {
      return validationResult
    }

    this.register(data, uri)

    const parts: Try<any>[] = []

    for (const [name, mediaTypeObj] of entries(data)) {
      parts.push(this.resolveMediaTypeObject(mediaTypeObj, this.context().uri.append(uri, name)))
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data!) : merged
  }
}
