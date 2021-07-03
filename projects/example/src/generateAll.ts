import { generate } from '@oats-ts/generator'
import { openAPIReader } from '@oats-ts/openapi-reader'
import { parameterTypes } from '@oats-ts/openapi-parameter-types-generator'
import { validators } from '@oats-ts/openapi-validators-generator'
import { types } from '@oats-ts/openapi-types-generator'
import { api } from '@oats-ts/openapi-api-generator'
import { typeGuards } from '@oats-ts/openapi-type-guards-generator'
import { operations } from '@oats-ts/openapi-operations-generator'
import { prettierStringify, typeScriptWriter } from '@oats-ts/typescript-writer'
import { NameProvider, OpenAPIGeneratorTarget, defaultNameProvider } from '@oats-ts/openapi-common'
import { join, resolve } from 'path'
import { readFileSync } from 'fs'

const prettierConfiguration = JSON.parse(readFileSync(resolve('..', '..', '.prettierrc'), 'utf-8'))

function path(input: any, name: NameProvider, target: OpenAPIGeneratorTarget) {
  switch (target) {
    case 'openapi/operation':
    case 'openapi/headers-serializer':
    case 'openapi/headers-type':
    case 'openapi/input-type':
    case 'openapi/path-serializer':
    case 'openapi/path-type':
    case 'openapi/query-serializer':
    case 'openapi/query-type':
    case 'openapi/expectations':
    case 'openapi/response-type':
      return resolve(join('generated', 'operations', `${name(input, 'openapi/operation')}.ts`))
    case 'openapi/api-class':
    case 'openapi/api-type':
    case 'openapi/api-stub':
      return resolve(join('generated', 'apiRequests.ts'))
    case 'openapi/validator':
      return resolve(join('generated', 'validators.ts'))
    case 'openapi/type-guard':
      return resolve(join('generated', 'typeGuards.ts'))
    case 'openapi/type':
      return resolve(join('generated', 'types.ts'))
    default:
      throw new TypeError(`Unexpected target "${target}".`)
  }
}

function name(input: any, name: string, target: OpenAPIGeneratorTarget): string {
  if (target === 'openapi/response-type') {
    return `${defaultNameProvider(input, name, target)}Type`
  }
  return defaultNameProvider(input, name, target)
}

generate({
  log: true,
  reader: openAPIReader({ path: 'adyen.json' }),
  generators: [
    types({
      name,
      path,
      documentation: true,
      enums: true,
    }),
    validators({
      name,
      path,
      references: false,
      arrays: false,
      records: false,
      unionReferences: true,
    }),
    typeGuards({
      name,
      path,
      references: true,
      arrays: true,
      records: true,
      unionReferences: true,
    }),
    parameterTypes({
      name,
      path,
      documentation: true,
    }),
    operations({
      name,
      path,
      documentation: true,
    }),
    api({
      name,
      path,
      type: true,
      class: true,
      stub: true,
      documentation: true,
    }),
  ],
  writer: typeScriptWriter({ stringify: prettierStringify(prettierConfiguration) }),
})
