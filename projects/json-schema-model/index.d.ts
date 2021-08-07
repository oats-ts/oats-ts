export type ReferenceObject = {
  $ref: string
}

export type Referenceable<T> = ReferenceObject | T

export type ExternalDocumentationObject = {
  description?: string
  url: string
}

export type SchemaObjectType = 'integer' | 'number' | 'string' | 'boolean' | 'object' | 'null' | 'array'

export type SchemaObject = {
  // From JSON schema V7 draft
  title?: string
  type?: SchemaObjectType
  required?: string[]
  multipleOf?: number
  maximum?: number
  exclusiveMaximum?: boolean
  minimum?: number
  exclusiveMinimum?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  maxProperties?: number
  minProperties?: number
  enum?: any[]
  const?: any
  examples?: any[]
  if?: Referenceable<SchemaObject>
  then?: Referenceable<SchemaObject>
  else?: Referenceable<SchemaObject>
  readOnly?: boolean
  writeOnly?: boolean
  properties?: Record<string, Referenceable<SchemaObject>>
  patternProperties?: Record<string, Referenceable<SchemaObject>>
  additionalProperties?: Referenceable<SchemaObject> | boolean
  additionalItems?: Referenceable<SchemaObject> | boolean
  items?: Referenceable<SchemaObject>
  propertyNames?: Referenceable<SchemaObject>
  contains?: Referenceable<SchemaObject>
  allOf?: Referenceable<SchemaObject>[]
  oneOf?: Referenceable<SchemaObject>[]
  anyOf?: Referenceable<SchemaObject>[]
  not?: Referenceable<SchemaObject>

  // Adjusted
  description?: string
  format?: string
  default?: any

  // Extra fields
  discriminator?: DiscriminatorObject
  externalDocs?: ExternalDocumentationObject
  deprecated?: boolean
}

export interface DiscriminatorObject {
  propertyName?: string
  mapping?: Record<string, string>
}
