export type AsyncApiObject = {
  asyncapi: string
  id?: string
  info: InfoObject
  servers?: ServersObject
  channels: ChannelsObject
  components?: ComponentsObject
  tags?: TagObject[]
  externalDocs?: ExternalDocumentationObject
}

export type ReferenceObject = {
  $ref: string
}

export type InfoObject = {
  title: string
  version: string
  description?: string
  termsOfService?: string
  contact?: ContactObject
  license?: LicenseObject
}

export type ContactObject = {
  name?: string
  email?: string
  url?: string
}

export type LicenseObject = {
  name: string
  url?: string
}

export type ServersObject = Record<string, ServerObject>

export type ServerObject = {
  url: string
  protocol: string
  protocolVersion?: string
  description?: string
  variables?: Record<string, ServerVariableObject>
  security?: SecurityRequirementObject[]
  bindings?: ServerBindingsObject
}

export type ServerVariableObject = {
  enum?: string[]
  default?: string
  description?: string
  examples?: string[]
}

export type SecurityRequirementObject = Record<string, string[]>

export type ChannelsObject = Record<string, ChannelItemObject | ReferenceObject>

export type ChannelItemObject = {
  description?: string
  subscribe?: OperationObject
  publish?: OperationObject
  parameters?: ParametersObject
  bindings?: ChannelBindingsObject
}

export type OperationObject = {
  operationId?: string
  summary?: string
  description?: string
  tags?: TagObject[]
  externalDocs?: ExternalDocumentationObject
  bindings?: Record<string, OperationBindingsObject>
  traits?: OperationTraitObject[]
  message?: MessageObject
}

export type ParametersObject = Record<string, ParameterObject | ReferenceObject>

export type ParameterObject = {
  description?: string
  schema?: SchemaObject
  location?: string
}

export type TagObject = {
  name: string
  description?: string
  externalDocs?: ExternalDocumentationObject
}

export type ExternalDocumentationObject = {
  description?: string
  url: string
}

export type OperationTraitObject = {
  operationId?: string
  summary?: string
  description?: string
  tags?: TagObject[]
  externalDocs?: ExternalDocumentationObject
  bindings?: Record<string, OperationBindingsObject>
}

export type MessageObject = {
  headers?: SchemaObject | ReferenceObject
  payload?: any
  correlationId?: CorrelationIDObject | ReferenceObject
  schemaFormat?: string
  contentType?: string
  name?: string
  title?: string
  summary?: string
  description?: string
  tags?: TagObject[]
  externalDocs?: ExternalDocumentationObject
  bindings?: MessageBindingsObject
  examples?: Record<string, any>[]
  traits?: MessageTraitObject
}

export type CorrelationIDObject = {
  description?: string
  location: string
}

export type MessageTraitObject = {
  headers?: SchemaObject | ReferenceObject
  correlationId?: CorrelationIDObject | ReferenceObject
  schemaFormat?: string
  contentType?: string
  name?: string
  title?: string
  summary?: string
  description?: string
  tags?: TagObject[]
  externalDocs?: ExternalDocumentationObject
  bindings?: MessageBindingsObject
  examples?: Record<string, any>[]
}

export type ComponentsObject = {
  schemas?: Record<string, SchemaObject | ReferenceObject>
  messages?: Record<string, MessageObject | ReferenceObject>
  securitySchemes?: Record<string, SecuritySchemeObject | ReferenceObject>
  parameters?: Record<string, ParameterObject | ReferenceObject>
  correlationIds?: Record<string, CorrelationIDObject>
  operationTraits?: Record<string, OperationTraitObject>
  messageTraits?: Record<string, MessageTraitObject>
  serverBindings?: Record<string, ServerBindingObject>
  channelBindings?: Record<string, ChannelBindingObject>
  operationBindings?: Record<string, OperationBindingObject>
  messageBindings?: Record<string, MessageBindingObject>
}

export type ApiKeyLocation = 'user' | 'password'

export type HttpApiKeyLocation = 'query' | 'header' | 'cookie'

export type SecuritySchemeObjectType =
  | 'userPassword'
  | 'apiKey'
  | 'X509'
  | 'symmetricEncryption'
  | 'asymmetricEncryption'
  | 'httpApiKey'
  | 'http'
  | 'oauth2'
  | 'openIdConnect'

export type SecuritySchemeObject = {
  type: SecuritySchemeObjectType
  description?: string
  name?: string
  in?: ApiKeyLocation | HttpApiKeyLocation
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
  scopes?: Record<string, string>
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
  if?: SchemaObject | ReferenceObject
  then?: SchemaObject | ReferenceObject
  else?: SchemaObject | ReferenceObject
  readOnly?: boolean
  writeOnly?: boolean
  properties?: Record<string, SchemaObject | ReferenceObject>
  patternProperties?: Record<string, SchemaObject | ReferenceObject>
  additionalProperties?: SchemaObject | ReferenceObject | boolean
  additionalItems?: SchemaObject | ReferenceObject | boolean
  items?: SchemaObject | ReferenceObject
  propertyNames?: SchemaObject | ReferenceObject
  contains?: SchemaObject | ReferenceObject
  allOf?: (SchemaObject | ReferenceObject)[]
  oneOf?: (SchemaObject | ReferenceObject)[]
  anyOf?: (SchemaObject | ReferenceObject)[]
  not?: SchemaObject | ReferenceObject

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

export type ServerBindingsObject = {
  http?: HTTPServerBinding
  ws?: WebSocketsServerBinding
  kafka?: KafkaServerBinding
  amqp?: AMQPServerBinding
  amqp1?: AMQP1ServerBinding
  mqtt?: MQTTServerBinding
  mqtt5?: MQTT5ServerBinding
  nats?: NATSServerBinding
  jms?: JMSServerBinding
  sns?: SNSServerBinding
  sqs?: SQSServerBinding
  stomp?: STOMPServerBinding
  redis?: RedisServerBinding
}

export type HTTPServerBinding = {}

export type WebSocketsServerBinding = {}

export type KafkaServerBinding = {}

export type AMQPServerBinding = {}

export type AMQP1ServerBinding = {}

export type MQTTServerBindingLastWill = {
  topic?: string
  qos?: 0 | 1 | 2
  message?: string
  retain?: boolean
}

export type MQTTServerBinding = {
  clientId?: string
  cleanSession?: boolean
  lastWill: MQTTServerBindingLastWill
  keepAlive?: number
  bindingVersion?: string
}

export type MQTT5ServerBinding = {}

export type NATSServerBinding = {}

export type JMSServerBinding = {}

export type SNSServerBinding = {}

export type SQSServerBinding = {}

export type STOMPServerBinding = {}

export type RedisServerBinding = {}

export type ServerBindingObject =
  | HTTPServerBinding
  | WebSocketsServerBinding
  | KafkaServerBinding
  | AMQPServerBinding
  | AMQP1ServerBinding
  | MQTTServerBinding
  | MQTT5ServerBinding
  | NATSServerBinding
  | JMSServerBinding
  | SNSServerBinding
  | SQSServerBinding
  | STOMPServerBinding
  | RedisServerBinding

export type ChannelBindingsObject = {
  http?: HTTPChannelBinding
  ws?: WebSocketsChannelBinding
  kafka?: KafkaChannelBinding
  amqp?: AMQPChannelBinding
  amqp1?: AMQP1ChannelBinding
  mqtt?: MQTTChannelBinding
  mqtt5?: MQTT5ChannelBinding
  nats?: NATSChannelBinding
  jms?: JMSChannelBinding
  sns?: SNSChannelBinding
  sqs?: SQSChannelBinding
  stomp?: STOMPChannelBinding
  redis?: RedisChannelBinding
}

export type HTTPChannelBinding = {}

export type WebSocketsChannelBindingMethod = 'GET' | 'POST'

export type WebSocketsChannelBinding = {
  method: WebSocketsChannelBindingMethod
  query: SchemaObject | ReferenceObject
  headers: SchemaObject | ReferenceObject
  bindingVersion: string
}

export type KafkaChannelBinding = {}

export type AMQPChannelBindingExchange = {
  name?: string
  type?: string
  durable?: boolean
  autoDelete?: boolean
  vhost?: string
}

export type AMQPChannelBindingQueue = {
  name?: string
  durable?: boolean
  exclusive?: boolean
  autoDelete?: boolean
  vhost?: string
}

export type AMQPChannelBinding = {
  is?: string
  exchange?: AMQPChannelBindingExchange
  queue?: AMQPChannelBindingQueue
  bindingVersion?: string
}

export type AMQP1ChannelBinding = {}

export type MQTTChannelBinding = {}

export type MQTT5ChannelBinding = {}

export type NATSChannelBinding = {}

export type JMSChannelBinding = {}

export type SNSChannelBinding = {}

export type SQSChannelBinding = {}

export type STOMPChannelBinding = {}

export type RedisChannelBinding = {}

export type ChannelBindingObject =
  | HTTPChannelBinding
  | WebSocketsChannelBinding
  | KafkaChannelBinding
  | AMQPChannelBinding
  | AMQP1ChannelBinding
  | MQTTChannelBinding
  | MQTT5ChannelBinding
  | NATSChannelBinding
  | JMSChannelBinding
  | SNSChannelBinding
  | SQSChannelBinding
  | STOMPChannelBinding
  | RedisChannelBinding

export type OperationBindingsObject = {
  http?: HTTPOperationBinding
  ws?: WebSocketsOperationBinding
  kafka?: KafkaOperationBinding
  amqp?: AMQPOperationBinding
  amqp1?: AMQP1OperationBinding
  mqtt?: MQTTOperationBinding
  mqtt5?: MQTT5OperationBinding
  nats?: NATSOperationBinding
  jms?: JMSOperationBinding
  sns?: SNSOperationBinding
  sqs?: SQSOperationBinding
  stomp?: STOMPOperationBinding
  redis?: RedisOperationBinding
}

export type HTTPOperationBindingType = 'request' | 'response'
export type HTTPOperationBindingMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'CONNECT'
  | 'TRACE'

export type HTTPOperationBinding = {
  type?: HTTPOperationBindingType
  method?: HTTPOperationBindingMethod
  query?: SchemaObject | ReferenceObject
  bindingVersion?: string
}

export type WebSocketsOperationBinding = {}

export type KafkaOperationBinding = {
  groupId?: SchemaObject | ReferenceObject
  clientId?: SchemaObject | ReferenceObject
  bindingVersion?: string
}

export type AMQPOperationBinding = {
  expiration?: number
  userId?: string
  cc?: string[]
  priority?: number
  deliveryMode?: number
  mandatory?: boolean
  bcc?: string[]
  replyTo?: string
  timestamp?: boolean
  ack?: boolean
  bindingVersion?: string
}

export type AMQP1OperationBinding = {}

export type MQTTOperationBinding = {
  qos?: number
  retain?: boolean
  bindingVersion?: string
}

export type MQTT5OperationBinding = {}

export type NATSOperationBinding = {}

export type JMSOperationBinding = {}

export type SNSOperationBinding = {}

export type SQSOperationBinding = {}

export type STOMPOperationBinding = {}

export type RedisOperationBinding = {}

export type OperationBindingObject =
  | HTTPOperationBinding
  | WebSocketsOperationBinding
  | KafkaOperationBinding
  | AMQPOperationBinding
  | AMQP1OperationBinding
  | MQTTOperationBinding
  | MQTT5OperationBinding
  | NATSOperationBinding
  | JMSOperationBinding
  | SNSOperationBinding
  | SQSOperationBinding
  | STOMPOperationBinding
  | RedisOperationBinding

export type MessageBindingsObject = {
  http?: HTTPMessageBinding
  ws?: WebSocketsMessageBinding
  kafka?: KafkaMessageBinding
  amqp?: AMQPMessageBinding
  amqp1?: AMQP1MessageBinding
  mqtt?: MQTTMessageBinding
  mqtt5?: MQTT5MessageBinding
  nats?: NATSMessageBinding
  jms?: JMSMessageBinding
  sns?: SNSMessageBinding
  sqs?: SQSMessageBinding
  stomp?: STOMPMessageBinding
  redis?: RedisMessageBinding
}

export type HTTPMessageBinding = {
  headers: SchemaObject | ReferenceObject
  bindingVersion: string
}

export type WebSocketsMessageBinding = {}

export type KafkaMessageBinding = {
  key?: SchemaObject | ReferenceObject
  bindingVersion?: string
}

export type AMQPMessageBinding = {
  contentEncoding?: string
  messageType?: string
  bindingVersion?: string
}

export type AMQP1MessageBinding = {}

export type MQTTMessageBinding = {
  bindingVersion?: string
}

export type MQTT5MessageBinding = {}

export type NATSMessageBinding = {}

export type JMSMessageBinding = {}

export type SNSMessageBinding = {}

export type SQSMessageBinding = {}

export type STOMPMessageBinding = {}

export type RedisMessageBinding = {}

export type MessageBindingObject =
  | HTTPMessageBinding
  | WebSocketsMessageBinding
  | KafkaMessageBinding
  | AMQPMessageBinding
  | AMQP1MessageBinding
  | MQTTMessageBinding
  | MQTT5MessageBinding
  | NATSMessageBinding
  | JMSMessageBinding
  | SNSMessageBinding
  | SQSMessageBinding
  | STOMPMessageBinding
  | RedisMessageBinding