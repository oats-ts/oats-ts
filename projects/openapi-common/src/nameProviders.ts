import pascalCase from 'pascalcase'
import camelCase from 'camelcase'
import { isNil } from 'lodash'
import { GeneratorNameProvider } from '@oats-ts/generator'
import { DelegatingNameProviderInput, OpenAPIGeneratorTarget } from './typings'

const delegating =
  (delegates: Partial<DelegatingNameProviderInput> = {}): GeneratorNameProvider =>
  (input: any, name: string, target: string): string | undefined => {
    const delegate = delegates[target as OpenAPIGeneratorTarget]
    if (isNil(delegate)) {
      throw new Error(`No name provider delegate found for "${target}}"`)
    }
    return delegate(input, name, target)
  }

const nonNull =
  (producer?: GeneratorNameProvider) =>
  (delegate: GeneratorNameProvider) =>
  (input: any, name: string, target: string): string | undefined => {
    const generatedName = isNil(producer) ? name : producer(input, name, target)
    return isNil(generatedName) ? undefined : delegate(input, generatedName, target)
  }

const type = nonNull()((input: any, name: string) => pascalCase(name))
const typeValidator = nonNull()((input: any, name: string) => `${camelCase(name)}TypeValidator`)
const typeGuard = nonNull()((input: any, name: string) => camelCase(`is-${name}`))
const operation: GeneratorNameProvider = (op: any, name: string) =>
  isNil(op.operationId) ? undefined : camelCase(op.operationId)

const queryType = nonNull(operation)((input: any, name: string) => pascalCase(`${name}QueryParameters`))
const pathType = nonNull(operation)((input: any, name: string) => pascalCase(`${name}PathParameters`))
const requestHeadersType = nonNull(operation)((input: any, name: string) =>
  pascalCase(`${name}RequestHeaderParameters`),
)
const responseHeadersType = (input: any, name: string) => {
  const [op, status] = input
  const operationName = operation(op, name, 'openapi/operation')
  return isNil(operationName) ? undefined : pascalCase(`${operationName}${pascalCase(status)}ResponseHeaderParameters`)
}
const responseType = nonNull(operation)((input: any, name: string) => pascalCase(`${name}Response`))
const requestType = nonNull(operation)((input: any, name: string) => pascalCase(`${name}Request`))
const serverRequest = nonNull(operation)((input: any, name: string) => pascalCase(`${name}ServerRequest`))
const pathSerializer = nonNull(operation)((input: any, name: string) => camelCase(`${name}PathSerializer`))
const pathDeserializer = nonNull(operation)((input: any, name: string) => camelCase(`${name}PathDeserializer`))
const querySerializer = nonNull(operation)((input: any, name: string) => camelCase(`${name}QuerySerializer`))
const queryDeserializer = nonNull(operation)((input: any, name: string) => camelCase(`${name}QueryDeserializer`))
const reqHeadersSerializer = nonNull(operation)((input: any, name: string) =>
  camelCase(`${name}RequestHeadersSerializer`),
)
const reqHeadersDeserializer = nonNull(operation)((input: any, name: string) =>
  camelCase(`${name}RequestHeadersDeserializer`),
)
const resHeadersSerializer = nonNull(operation)((input: any, name: string) =>
  camelCase(`${name}ResponseHeadersSerializer`),
)
const resHeadersDeserializer = nonNull(operation)((input: any, name: string) =>
  camelCase(`${name}ResponseHeadersDeserializer`),
)
const reqBodyValidator = nonNull(operation)((input: any, name: string) => camelCase(`${name}RequestBodyValidator`))
const resBodyValidator = nonNull(operation)((input: any, name: string) => camelCase(`${name}ResponseBodyValidator`))
const expressRouter = nonNull(operation)((input: any, name: string) => camelCase(`${name}Router`))
const documentTitle = (doc: any) => pascalCase(doc.info?.title || '')
const sdk: GeneratorNameProvider = (doc: any) => `${documentTitle(doc)}Sdk`
const sdkStub: GeneratorNameProvider = (doc: any) => `${documentTitle(doc)}SdkStub`
const clientSdk: GeneratorNameProvider = (doc: any) => `${documentTitle(doc)}ClientSdk`
const api: GeneratorNameProvider = (doc: any) => `${documentTitle(doc)}Api`
const apiStub: GeneratorNameProvider = (doc: any) => `${documentTitle(doc)}ApiStub`
const routerFactory: GeneratorNameProvider = (doc: any) => `create${documentTitle(doc)}Router`
const routersType: GeneratorNameProvider = (doc: any) => `${documentTitle(doc)}Routers`

const defaultDelegates: DelegatingNameProviderInput = {
  'openapi/type': type,
  'openapi/type-guard': typeGuard,
  'openapi/operation': operation,
  'openapi/query-type': queryType,
  'openapi/path-type': pathType,
  'openapi/request-headers-type': requestHeadersType,
  'openapi/response-headers-type': responseHeadersType,
  'openapi/response-type': responseType,
  'openapi/request-type': requestType,
  'openapi/request-server-type': serverRequest,
  'openapi/path-serializer': pathSerializer,
  'openapi/path-deserializer': pathDeserializer,
  'openapi/query-serializer': querySerializer,
  'openapi/query-deserializer': queryDeserializer,
  'openapi/request-headers-serializer': reqHeadersSerializer,
  'openapi/request-headers-deserializer': reqHeadersDeserializer,
  'openapi/response-headers-serializer': resHeadersSerializer,
  'openapi/response-headers-deserializer': resHeadersDeserializer,
  'openapi/type-validator': typeValidator,
  'openapi/request-body-validator': reqBodyValidator,
  'openapi/response-body-validator': resBodyValidator,
  'openapi/express-route': expressRouter,
  'openapi/sdk-type': sdk,
  'openapi/sdk-stub': sdkStub,
  'openapi/client-sdk': clientSdk,
  'openapi/api-type': api,
  'openapi/express-route-factory': routerFactory,
  'openapi/express-routes-type': routersType,
}

const defaultNameProvider = (delegates: Partial<DelegatingNameProviderInput> = {}): GeneratorNameProvider =>
  delegating({ ...defaultDelegates, ...delegates })

export const nameProviders = {
  default: defaultNameProvider,
}
