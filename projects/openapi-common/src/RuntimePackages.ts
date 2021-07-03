const Validators = {
  name: '@oats-ts/validators',
  string: 'string',
  enumeration: 'enumeration',
  number: 'number',
  boolean: 'boolean',
  array: 'array',
  object: 'object',
  optional: 'optional',
  shape: 'shape',
  items: 'items',
  record: 'record',
  any: 'any',
  union: 'union',
  lazy: 'lazy',
  literal: 'literal',
}

const Http = {
  name: '@oats-ts/http',
  ResponseExpectations: 'ResponseExpectations',
  ResponseExpectation: 'ResponseExpectation',
  RequestConfig: 'RequestConfig',
  HttpResponse: 'HttpResponse',
  StatusCode: 'StatusCode',
  HttpRequest: 'HttpRequest',
  HttpHeaders: 'HttpHeaders',
  HttpMethod: 'HttpMethod',
  execute: 'execute',
}

const ParameterSerialization = {
  name: '@oats-ts/openapi-parameter-serialization',
  joinUrl: 'joinUrl',
  createHeaderSerializer: 'createHeaderSerializer',
  createPathSerializer: 'createPathSerializer',
  createQuerySerializer: 'createQuerySerializer',
}

export const RuntimePackages = {
  Validators,
  Http,
  ParameterSerialization,
}
