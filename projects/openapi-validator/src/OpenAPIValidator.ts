import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { getInferredType, isReferenceObject, tick } from '@oats-ts/model-common'
import { ContentValidator, URIManipulator, URIManipulatorType, ValidatorEventEmitter } from '@oats-ts/oats-ts'
import {
  ComponentsObject,
  ContentObject,
  HeaderObject,
  HeadersObject,
  MediaTypeObject,
  OpenAPIObject,
  OperationObject,
  ParameterLocation,
  ParameterObject,
  PathItemObject,
  PathsObject,
  RequestBodyObject,
  ResponseObject,
  ResponsesObject,
} from '@oats-ts/openapi-model'
import { ParameterSegment, parsePathToSegments, PathSegment } from '@oats-ts/openapi-parameter-serialization'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { failure, fluent, fromArray, fromPromiseSettledResult, isSuccess, success, Try } from '@oats-ts/try'
import { DefaultConfig, isOk, Issue, Validator, ValidatorConfig, ValidatorType } from '@oats-ts/validators'
import { entries, flatMap, isNil, values } from 'lodash'
import { OpenAPIValidatorContextImpl } from './OpenApiValidatorContextImpl'
import { severityComparator } from '@oats-ts/validators'
import { factories, StructuralValidators } from './structural'
import { OpenAPIValidatorContext } from './typings'

export class OpenAPIValidator implements ContentValidator<OpenAPIObject, OpenAPIReadOutput> {
  private readonly _structural: StructuralValidators
  private _context!: OpenAPIValidatorContext
  private _config!: ValidatorConfig
  private _uri!: URIManipulatorType

  public constructor() {
    this._structural = factories
    this.init()
  }

  public name(): string {
    return '@oats-ts/openapi-validator'
  }

  public async validate(
    data: OpenAPIReadOutput,
    emitter: ValidatorEventEmitter<OpenAPIObject>,
  ): Promise<Try<OpenAPIReadOutput>> {
    emitter.emit('validator-step-started', {
      type: 'validator-step-started',
      name: this.name(),
    })

    await tick()

    this._context = this.createContext(data)
    this._uri = this.createURIManipulator()
    this._config = this.createValidatorConfig()

    const validationResult = await Promise.allSettled(
      this.context()
        .documents()
        .map((document) => this.validateDocument(document, emitter)),
    )
    const results = fluent(fromArray(validationResult.map(fromPromiseSettledResult))).map((data) =>
      flatMap(data).sort(severityComparator),
    )
    const allIssues = Array.from(isSuccess(results) ? results.data : results.issues).sort(severityComparator)
    const hasNoCriticalIssues = isOk(allIssues)
    emitter.emit('validator-step-completed', {
      type: 'validate-step-completed',
      name: this.name(),
      issues: allIssues,
    })

    return hasNoCriticalIssues ? success(data) : failure(...allIssues)
  }

  async validateDocument(document: OpenAPIObject, emitter: ValidatorEventEmitter<OpenAPIObject>): Promise<Issue[]> {
    emitter.emit('validate-file-started', {
      type: 'validate-file-started',
      path: this.context().uriOf(document),
      data: document,
    })

    await tick()
    let issues: Issue[] = []
    try {
      issues = this.validateOpenApiObject(document).sort(severityComparator)
    } catch (e) {
      console.error(e)
    }
    const hasNoCriticalIssue = isOk(issues)
    const result = hasNoCriticalIssue ? success(document) : failure(...issues)

    await tick()

    emitter.emit('validate-file-completed', {
      type: 'validate-file-completed',
      path: this.context().uriOf(document),
      data: result,
      issues,
    })

    await tick()

    return issues
  }

  protected createContext(data: OpenAPIReadOutput): OpenAPIValidatorContext {
    return new OpenAPIValidatorContextImpl(data)
  }

  protected createURIManipulator(): URIManipulatorType {
    return new URIManipulator()
  }

  protected createValidatorConfig(): ValidatorConfig {
    return {
      ...DefaultConfig,
      append: (uri: string, ...pieces: (string | number)[]): string => {
        return this._uri.append(uri, ...pieces)
      },
      severity: (type: ValidatorType) => {
        if (type === 'restrictKeys') {
          return 'info'
        }
        return 'error'
      },
      message: (type: ValidatorType, path: string, data?: any) => {
        if (type === 'restrictKeys') {
          return 'excess unused field'
        }
        return DefaultConfig.message(type, path, data)
      },
    }
  }

  protected init() {
    this.validateReferenceObject = this.fn(this.validateReferenceObject, this.structural().referenceObject())
    this.validateOpenApiObject = this.fn(this.validateOpenApiObject, this.structural().openApiObject())
    this.validateComponentsObject = this.fn(this.validateComponentsObject, this.structural().componentsObject())
    this.validatePathsObject = this.fn(this.validatePathsObject, this.structural().pathsObject())
    this.validatePathItemObject = this.fn(this.validatePathItemObject, this.structural().pathItemObject())
    this.validateOperationObject = this.fn(this.validateOperationObject, this.structural().operationObject())
    this.validateRequestBodyObject = this.fn(this.validateRequestBodyObject, this.structural().requestBodyObject())
    this.validateContentObject = this.fn(this.validateContentObject, this.structural().contentObject())
    this.validateMediaTypeObject = this.fn(this.validateMediaTypeObject, this.structural().mediaTypeObject())
    this.validateResponsesObject = this.fn(this.validateResponsesObject, this.structural().responsesObject())
    this.validateResponseObject = this.fn(this.validateResponseObject, this.structural().responseObject())
    this.validateHeadersObject = this.fn(this.validateHeadersObject, this.structural().headersObject())
    this.validateHeaderObject = this.fn(this.validateHeaderObject, this.structural().headerObject())
    this.validateArraySchemaObject = this.fn(this.validateArraySchemaObject, this.structural().arraySchemaObject())
    this.validateEnumSchemaObject = this.fn(this.validateEnumSchemaObject, this.structural().enumSchemaObject())
    this.validateRecordSchemaObject = this.fn(this.validateRecordSchemaObject, this.structural().recordSchemaObject())
    this.validateObjectSchemaObject = this.fn(this.validateObjectSchemaObject, this.structural().objectSchemaObject())
    this.validateTupleSchemaObject = this.fn(this.validateTupleSchemaObject, this.structural().tupleSchemaObject())
    this.validateLiteralSchemaObject = this.fn(
      this.validateLiteralSchemaObject,
      this.structural().literalSchemaObject(),
    )
    this.validateIntersectionSchemaObject = this.fn(
      this.validateIntersectionSchemaObject,
      this.structural().intersectionSchemaObject(),
    )
    this.validateNonDiscriminatedUnionSchemaObject = this.fn(
      this.validateNonDiscriminatedUnionSchemaObject,
      this.structural().nonDiscriminatedUnionSchemaObject(),
    )
    this.validateDiscriminatedUnionSchemaObject = this.fn(
      this.validateDiscriminatedUnionSchemaObject,
      this.structural().discriminatedUnionSchemaObject(),
    )
    this.validatePrimitiveSchemaObject = this.fn(
      this.validatePrimitiveSchemaObject,
      this.structural().primitiveSchemaObject(),
    )
    this.validateCookieParameterObject = this.fn(
      this.validateCookieParameterObject,
      this.structural().cookieParameterObject(),
    )
    this.validatePathParameterObject = this.fn(
      this.validatePathParameterObject,
      this.structural().pathParameterObject(),
    )
    this.validateQueryParameterObject = this.fn(
      this.validateQueryParameterObject,
      this.structural().queryParameterObject(),
    )
    this.validateHeaderParameterObject = this.fn(
      this.validateHeaderParameterObject,
      this.structural().headerParameterObject(),
    )
  }

  protected context(): OpenAPIValidatorContext {
    return this._context
  }

  protected config(): ValidatorConfig {
    return this._config
  }

  protected structural(): StructuralValidators {
    return this._structural
  }

  protected isCritical(issues: Issue[]): boolean {
    return issues.some((issue) => issue.severity === 'error')
  }

  protected fn<T>(fn: (data: T) => Issue[], structural?: Validator<any>): (data: T) => Issue[] {
    return (data: T): Issue[] => {
      if (this.context().validated.has(data)) {
        return []
      }
      this.context().validated.add(data)

      const structuralIssues = structural?.(data, this.context().uriOf(data), this.config()) ?? []
      if (this.isCritical(structuralIssues)) {
        return structuralIssues
      }
      return [...structuralIssues, ...fn.call(this, data)]
    }
  }

  protected getParamsByLocation(
    params: Referenceable<ParameterObject>[],
    location: ParameterLocation,
  ): ParameterObject[] {
    return (params || [])
      .map((param) => this.context().dereference<ParameterObject>(param))
      .filter((param) => param.in === location)
  }

  protected getOperations(data: PathItemObject): OperationObject[] {
    const { get, put, post, delete: _delete, options, head, patch } = data
    return [get, put, post, _delete, options, head, patch].filter(
      (operation): operation is OperationObject => !isNil(operation),
    )
  }

  protected validateReferenceable<T>(
    data: Referenceable<T>,
    forceTargetValidation: boolean,
    validator: (data: T) => Issue[],
  ): Issue[] {
    if (!isNil(data) && isReferenceObject(data)) {
      const refIssues = this.validateReferenceObject(data)
      if (forceTargetValidation) {
        return !this.isCritical(refIssues)
          ? [...refIssues, ...validator(this.context().dereference<T>(data))]
          : refIssues
      }
      return refIssues
    }
    return validator(data)
  }

  protected checkReferenceCycle(input: ReferenceObject, visited: Set<ReferenceObject>): Set<ReferenceObject> | false {
    if (visited.has(input)) {
      return visited
    }
    visited.add(input)
    const target = this.context().dereference(input)
    if (isNil(target)) {
      return false
    }
    if (isReferenceObject(target)) {
      return this.checkReferenceCycle(target, visited)
    }
    return false
  }

  protected validateReferenceObject(data: ReferenceObject): Issue[] {
    if (isNil(this.context().dereference(data))) {
      return [
        {
          message: `${data.$ref} is an invalid reference`,
          path: this.context().uriOf(data),
          severity: 'error',
        },
      ]
    }

    const depCycle = this.checkReferenceCycle(data, new Set())
    if (depCycle === false) {
      return []
    }
    return [
      {
        message: `circular $ref detected`,
        path: this.context().uriOf(data),
        severity: 'error',
      },
    ]
  }

  protected validateOpenApiObject(data: OpenAPIObject): Issue[] {
    return [
      ...(isNil(data.components) ? [] : this.validateComponentsObject(data.components)),
      ...(isNil(data.paths) ? [] : this.validatePathsObject(data.paths)),
    ]
  }

  protected validateComponentsObject(data: ComponentsObject): Issue[] {
    return [
      ...flatMap(values(data.schemas ?? {}), (schema) =>
        this.validateReferenceable(schema, false, (schema) => this.validateSchemaObject(schema)),
      ),
      ...flatMap(values(data.parameters ?? {}), (param) =>
        this.validateReferenceable(param, false, (param) => this.validateParameterObject(param)),
      ),
      ...flatMap(values(data.responses ?? {}), (response) =>
        this.validateReferenceable(response, false, (response) => this.validateResponseObject(response)),
      ),
      ...flatMap(values(data.requestBodies ?? {}), (reqBody) =>
        this.validateReferenceable(reqBody, false, (reqBody) => this.validateRequestBodyObject(reqBody)),
      ),
    ]
  }

  protected validateSchemaObject(data: SchemaObject): Issue[] {
    switch (getInferredType(data)) {
      case 'array':
        return this.validateArraySchemaObject(data)
      case 'boolean':
      case 'string':
      case 'number':
        return this.validatePrimitiveSchemaObject(data)
      case 'enum':
        return this.validateEnumSchemaObject(data)
      case 'object':
        return this.validateObjectSchemaObject(data)
      case 'record':
        return this.validateRecordSchemaObject(data)
      case 'union':
        return this.validateUnionSchemaObject(data)
      case 'intersection':
        return this.validateIntersectionSchemaObject(data)
      case 'literal':
        return this.validateLiteralSchemaObject(data)
      case 'tuple':
        return this.validateTupleSchemaObject(data)
      default:
        return [
          {
            message: 'cannot infer type of schema',
            path: this.context().uriOf(data),
            severity: 'warning',
          },
        ]
    }
  }

  protected validateArraySchemaObject(data: SchemaObject, items?: (data: SchemaObject) => Issue[]): Issue[] {
    return [
      ...(typeof data.items === 'boolean'
        ? []
        : this.validateReferenceable(data.items!, false, items ?? ((schema) => this.validateSchemaObject(schema)))),
    ]
  }

  protected validatePrimitiveSchemaObject(data: SchemaObject): Issue[] {
    return []
  }

  protected validateEnumSchemaObject(data: SchemaObject): Issue[] {
    return []
  }

  protected validateLiteralSchemaObject(data: SchemaObject): Issue[] {
    return []
  }

  protected validateObjectSchemaObject(data: SchemaObject, properties?: (data: SchemaObject) => Issue[]): Issue[] {
    return [
      ...flatMap(values(data.properties ?? {}), (schema) =>
        this.validateReferenceable(schema, true, properties ?? ((schema) => this.validateSchemaObject(schema))),
      ),
    ]
  }

  protected validateTupleSchemaObject(data: SchemaObject, items?: (data: SchemaObject) => Issue[]): Issue[] {
    return [
      ...flatMap(data.prefixItems ?? [], (schema) =>
        this.validateReferenceable(schema, false, items ?? ((schema) => this.validateSchemaObject(schema))),
      ),
    ]
  }

  protected validateRecordSchemaObject(data: SchemaObject, properties?: (data: SchemaObject) => Issue[]): Issue[] {
    return [
      ...this.validateReferenceable(
        data.additionalProperties as Referenceable<SchemaObject>,
        false,
        properties ?? ((schema) => this.validateSchemaObject(schema)),
      ),
    ]
  }

  protected validateUnionSchemaObject(data: SchemaObject): Issue[] {
    return isNil(data.discriminator)
      ? this.validateNonDiscriminatedUnionSchemaObject(data)
      : this.validateDiscriminatedUnionSchemaObject(data)
  }

  protected validateNonDiscriminatedUnionSchemaObject(data: SchemaObject): Issue[] {
    return [
      ...flatMap(data.oneOf, (schema: Referenceable<SchemaObject>): Issue[] =>
        this.validateReferenceable(schema, false, (schema) => this.validateSchemaObject(schema)),
      ),
    ]
  }

  protected validateDiscriminatedUnionSchemaObject(data: SchemaObject): Issue[] {
    const name = this.context().nameOf(data)
    if (isNil(name)) {
      return [
        {
          message: `only named schemas can have the "discriminator" field`,
          path: this.context().uriOf(data),
          severity: 'error',
        },
      ]
    }

    const { discriminator, oneOf } = data
    const discriminatorValues = entries(discriminator?.mapping ?? {})
    const oneOfRefs = (oneOf ?? []) as ReferenceObject[]

    return [
      ...oneOfRefs
        .filter((ref) => !discriminatorValues.some(([, refTarget]) => ref.$ref === refTarget))
        .map(
          (ref): Issue => ({
            message: `"discriminator" is missing "${ref.$ref}"`,
            path: this.context().uriOf(discriminator),
            severity: 'error',
          }),
        ),
      ...discriminatorValues
        .filter(([, refTarget]) => !oneOfRefs.some((ref) => ref.$ref === refTarget))
        .map(
          ([prop, ref]): Issue => ({
            message: `"${prop}" referencing "${ref}" in "discriminator" has no counterpart in "oneOf"`,
            path: this.context().uriOf(discriminator),
            severity: 'error',
          }),
        ),
      ...flatMap(oneOf, (ref): Issue[] => {
        const schema = this.context().dereference(ref)
        switch (getInferredType(schema)) {
          case 'object':
            return this.validateObjectSchemaObject(schema)
          case 'union':
            return this.validateDiscriminatedUnionSchemaObject(schema)
          default:
            return [
              {
                message: `should reference either an "object" schema or another schema with "discriminator"`,
                path: this.context().uriOf(ref),
                severity: 'error',
              },
            ]
        }
      }),
    ]
  }

  protected validateIntersectionSchemaObject(data: SchemaObject): Issue[] {
    return [
      ...flatMap(data.allOf, (schema): Issue[] =>
        this.validateReferenceable(schema, false, (schema) => this.validateSchemaObject(schema)),
      ),
    ]
  }

  protected validateParameterSchemaObject(data: SchemaObject): Issue[] {
    const type = getInferredType(data)
    switch (type) {
      case 'object':
        return this.validateObjectSchemaObject(data, (schema) => this.validatePrimitiveSchemaObject(schema))
      case 'record':
        return this.validateRecordSchemaObject(data, (schema) => this.validatePrimitiveSchemaObject(schema))
      case 'array':
        return this.validateArraySchemaObject(data, (schema) => this.validatePrimitiveSchemaObject(schema))
      case 'string':
      case 'number':
      case 'boolean':
        return this.validatePrimitiveSchemaObject(data)
      case 'enum':
        return this.validateEnumSchemaObject(data)
      default:
        return [
          {
            message:
              'should be either a primitive schema ("string", "number" or "boolean") or array/object of primitives',
            path: this.context().uriOf(data),
            severity: 'error',
          },
        ]
    }
  }

  protected validatePathsObject(data: PathsObject): Issue[] {
    return [
      ...flatMap(entries(data), ([url, pathItemObject]) => {
        const pathItemObjectIssues = this.validatePathItemObject(pathItemObject)
        if (this.isCritical(pathItemObjectIssues)) {
          return pathItemObjectIssues
        }
        return [...pathItemObjectIssues, ...this.validateUrlPathItemObjectUrl(url, pathItemObject)]
      }),
    ]
  }

  protected validatePathItemObject(data: PathItemObject): Issue[] {
    return [
      ...flatMap(this.getOperations(data), (operation) => this.validateOperationObject(operation)),
      ...flatMap(data.parameters ?? [], (param) =>
        this.validateReferenceable(param, true, (param) => this.validateParameterObject(param)),
      ),
    ]
  }

  protected validateUrlPathItemObjectUrl(url: string, data: PathItemObject): Issue[] {
    let segments: PathSegment[]
    try {
      segments = parsePathToSegments(url)
    } catch (e) {
      return [
        {
          message: `invalid path: "${url}" (${e})`,
          path: this.context().uriOf(data),
          severity: 'error',
        },
      ]
    }
    const pathSegments = segments.filter(({ type }) => type === 'parameter') as ParameterSegment[]
    const commonPathParams = this.getParamsByLocation(data.parameters ?? [], 'path')
    const operations = this.getOperations(data)
    return flatMap(operations, (operation): Issue[] => {
      const params = commonPathParams.concat(this.getParamsByLocation(operation.parameters ?? [], 'path'))
      const missing = pathSegments
        .filter((segment) => !params.some((param) => param.name === segment.name))
        .map(
          (segment): Issue => ({
            message: `parameter "${segment.name}" is missing`,
            path: this.context().uriOf(operation),
            severity: 'error',
          }),
        )
      const extra = params
        .filter((param) => !pathSegments.some((segment) => segment.name === param.name))
        .map(
          (param): Issue => ({
            message: `parameter "${param.name}" is not defined in "${url}"`,
            path: this.context().uriOf(operation),
            severity: 'error',
          }),
        )
      return [...missing, ...extra]
    })
  }

  protected validateOperationObject(data: OperationObject): Issue[] {
    return [
      ...flatMap(data.parameters ?? [], (parameter) =>
        this.validateReferenceable(parameter, true, (param) => this.validateParameterObject(param)),
      ),
      ...(isNil(data.requestBody)
        ? []
        : this.validateReferenceable(data.requestBody, false, (body) => this.validateRequestBodyObject(body))),
      ...this.validateReferenceable(data.responses, false, (res) => this.validateResponsesObject(res)),
    ]
  }

  protected validateParameterObject(data: ParameterObject): Issue[] {
    switch (data.in) {
      case 'cookie':
        return this.validateCookieParameterObject(data)
      case 'header':
        return this.validateHeaderParameterObject(data)
      case 'path':
        return this.validatePathParameterObject(data)
      case 'query':
        return this.validateQueryParameterObject(data)
    }
  }

  protected validateCookieParameterObject(data: ParameterObject): Issue[] {
    return [...this.validateReferenceable(data.schema!, false, (schema) => this.validatePrimitiveSchemaObject(schema))]
  }

  protected validateHeaderParameterObject(data: ParameterObject): Issue[] {
    return [...this.validateReferenceable(data.schema!, false, (schema) => this.validateParameterSchemaObject(schema))]
  }

  protected validatePathParameterObject(data: ParameterObject): Issue[] {
    return [...this.validateReferenceable(data.schema!, false, (schema) => this.validateParameterSchemaObject(schema))]
  }

  protected validateQueryParameterObject(data: ParameterObject): Issue[] {
    return [...this.validateReferenceable(data.schema!, false, (schema) => this.validateParameterSchemaObject(schema))]
  }

  protected validateRequestBodyObject(data: RequestBodyObject): Issue[] {
    return [...this.validateContentObject(data.content)]
  }

  protected validateContentObject(data: ContentObject): Issue[] {
    return [
      ...flatMap(entries(data), ([contentType, mediaType]): Issue[] => {
        const issues: Issue[] = []
        if (contentType !== 'application/json') {
          issues.push({
            message: `MIME type "${contentType}" might not be compatible with JSON schema`,
            path: this.context().uriOf(mediaType),
            severity: 'warning',
          })
        }
        issues.push(...this.validateMediaTypeObject(mediaType))
        return issues
      }),
    ]
  }

  protected validateMediaTypeObject(data: MediaTypeObject): Issue[] {
    if (isNil(data.schema)) {
      return [
        {
          message: 'missing schema (strict typing is impossible without it)',
          path: this.config().append(this.context().uriOf(data), 'schema'),
          severity: 'warning',
        },
      ]
    }
    return [...this.validateReferenceable(data.schema!, false, (schema) => this.validateSchemaObject(schema))]
  }

  protected validateResponsesObject(data: ResponsesObject): Issue[] {
    return [
      ...flatMap(entries(data), ([, response]): Issue[] => {
        return [...this.validateReferenceable(response!, false, (res) => this.validateResponseObject(res))]
      }),
    ]
  }

  protected validateResponseObject(data: ResponseObject): Issue[] {
    return [
      ...(isNil(data.content) ? [] : this.validateContentObject(data.content)),
      ...(isNil(data.headers) ? [] : this.validateHeadersObject(data.headers)),
    ]
  }

  protected validateHeadersObject(data: HeadersObject): Issue[] {
    return []
  }

  protected validateHeaderObject(data: HeaderObject): Issue[] {
    return []
  }
}
