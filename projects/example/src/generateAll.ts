import { generate } from '@oats-ts/generator'
import { openAPIReader } from '@oats-ts/openapi-reader'
import { types, operations, typeGuards, api, validators, parameterTypes } from '@oats-ts/openapi-generator'
import { prettierStringify, typeScriptWriter } from '@oats-ts/typescript-writer'
import { NameProvider, OpenAPIGeneratorTarget, defaultNameProvider } from '@oats-ts/openapi-common'
import { join, resolve } from 'path'
import { readFileSync } from 'fs'

const prettierConfiguration = JSON.parse(readFileSync(resolve('..', '..', '.prettierrc'), 'utf-8'))

function path(input: any, name: NameProvider, target: OpenAPIGeneratorTarget) {
  switch (target) {
    case 'operation':
    case 'operation-headers-serializer':
    case 'operation-headers-type':
    case 'operation-input-type':
    case 'operation-path-serializer':
    case 'operation-path-type':
    case 'operation-query-serializer':
    case 'operation-query-type':
    case 'operation-response-parser-hint':
    case 'operation-response-type':
      return resolve(join('generated', 'operations', `${name(input, 'operation')}.ts`))
    case 'api-class':
    case 'api-type':
    case 'api-stub':
      return resolve(join('generated', 'apiRequests.ts'))
    case 'validator':
      return resolve(join('generated', 'validators.ts'))
    case 'type-guard':
      return resolve(join('generated', 'typeGuards.ts'))
    case 'type':
      return resolve(join('generated', 'types.ts'))
    default:
      throw new TypeError(`Unexpected target "${target}".`)
  }
}

function name(input: any, name: string, target: OpenAPIGeneratorTarget): string {
  if (target === 'operation-response-type') {
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
