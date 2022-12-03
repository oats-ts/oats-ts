import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'

export type OpenAPIObject = {
  openapi: string
  info: InfoObject
  servers?: ServerObject[]
  paths?: PathsObject
  components?: ComponentsObject
  security?: SecurityRequirementObject[]
  tags?: TagObject[]
  externalDocs?: ExternalDocumentationObject
}

export type InfoObject = {
  title: string
  description?: string
  termsOfService?: string
  contact?: ContactObject
  license?: LicenseObject
  version: string
}

export type ContactObject = {
  name?: string
  url?: string
  email?: string
}

export type LicenseObject = {
  name: string
  url?: string
}

export type ServerObject = {
  url: string
  description?: string
  variables?: Record<string, ServerVariableObject>
}

export type ServerVariableObject = {
  enum?: string[] | boolean[] | number[]
  default: string | boolean | number
  description?: string
}

export type ComponentsObject = {
  schemas?: Record<string, Referenceable<SchemaObject>>
  responses?: Record<string, Referenceable<ResponseObject>>
  parameters?: Record<string, Referenceable<ParameterObject>>
  examples?: Record<string, Referenceable<ExampleObject>>
  requestBodies?: Record<string, Referenceable<RequestBodyObject>>
  headers?: HeadersObject
  securitySchemes?: Record<string, Referenceable<SecuritySchemeObject>>
  links?: Record<string, LinkObject>
  callbacks?: Record<string, Referenceable<CallbackObject>>
}

export type PathsObject = Record<string, PathItemObject>

export type PathItemObject = {
  $ref?: string
  summary?: string
  description?: string
  get?: OperationObject
  put?: OperationObject
  post?: OperationObject
  delete?: OperationObject
  options?: OperationObject
  head?: OperationObject
  patch?: OperationObject
  trace?: OperationObject
  servers?: ServerObject[]
  parameters?: Referenceable<ParameterObject>[]
}

export type OperationObject = {
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: ExternalDocumentationObject
  operationId?: string
  parameters?: Referenceable<ParameterObject>[]
  requestBody?: Referenceable<RequestBodyObject>
  responses: ResponsesObject
  callbacks?: Record<string, Referenceable<CallbackObject>>
  deprecated?: boolean
  security?: SecurityRequirementObject[]
  servers?: ServerObject[]
}

export type ExternalDocumentationObject = {
  description?: string
  url: string
}

export declare type ParameterLocation = 'query' | 'header' | 'path' | 'cookie'

export declare type ParameterStyle =
  | 'matrix'
  | 'label'
  | 'form'
  | 'simple'
  | 'spaceDelimited'
  | 'pipeDelimited'
  | 'deepObject'

export type BaseParameterObject = {
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: ParameterStyle
  explode?: boolean
  allowReserved?: boolean
  schema?: Referenceable<SchemaObject>
  examples?: {
    [param: string]: Referenceable<ExampleObject>
  }
  example?: any
  content?: ContentObject
}

export type ParameterObject = BaseParameterObject & {
  name: string
  in: ParameterLocation
}

export type RequestBodyObject = {
  description?: string
  content: ContentObject
  required?: boolean
}

export type ContentObject = Record<string, MediaTypeObject>

export type MediaTypeObject = {
  schema?: Referenceable<SchemaObject>
  examples?: Record<string, Referenceable<ExampleObject>>
  example?: any
  encoding?: Record<string, EncodingPropertyObject>
}

export type EncodingPropertyObject = {
  contentType?: string
  headers?: HeadersObject
  style?: string
  explode?: boolean
  allowReserved?: boolean
}

export type ResponsesObject = {
  default: Referenceable<ResponseObject> | undefined
  [statuscode: string]: Referenceable<ResponseObject> | undefined
}

export type ResponseObject = {
  description: string
  headers?: HeadersObject
  content?: ContentObject
  links?: Record<string, Referenceable<LinkObject>>
}

export type CallbackObject = Record<string, PathItemObject>

export type ExampleObject = {
  summary?: string
  description?: string
  value?: any
  externalValue?: string
}

export type LinkObject = {
  operationRef?: string
  operationId?: string
  parameters?: Record<string, string>
  requestBody?: any | string
  description?: string
  server?: ServerObject
  [property: string]: any
}

export type HeaderObject = BaseParameterObject

export type HeadersObject = Record<string, Referenceable<HeaderObject>>

export type TagObject = {
  name: string
  description?: string
  externalDocs?: ExternalDocumentationObject
}

export declare type SecuritySchemeType = 'apiKey' | 'http' | 'oauth2' | 'openIdConnect'

export type SecuritySchemeObject = {
  type: SecuritySchemeType
  description?: string
  name?: string
  in?: string
  scheme?: string
  bearerFormat?: string
  flows?: OAuthFlowsObject
  openIdConnectUrl?: string
}

export type OAuthFlowsObject = {
  implicit?: OAuthFlowObject
  password?: OAuthFlowObject
  clientCredentials?: OAuthFlowObject
  authorizationCode?: OAuthFlowObject
}

export type OAuthFlowObject = {
  authorizationUrl?: string
  tokenUrl?: string
  refreshUrl?: string
  scopes: Record<string, any>
}

export type SecurityRequirementObject = Record<string, string[]>
