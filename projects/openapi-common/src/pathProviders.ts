import { PathProvider, PathProviderHelper } from '@oats-ts/oats-ts'
import { isNil } from 'lodash'
import { join, resolve } from 'path'
import { OpenAPIGeneratorTarget, NameByTarget, DelegatingPathProviderInput, PathDelegate } from './typings'

const fileNameByTarget: NameByTarget = {
  'oats/type': 'types.ts',
  'oats/type-guard': 'typeGuards.ts',
  'oats/operation': 'operations.ts',
  'oats/query-type': 'queryTypes.ts',
  'oats/cookies-type': 'cookieTypes.ts',
  'oats/request-headers-type': 'requestHeaderTypes.ts',
  'oats/path-type': 'pathTypes.ts',
  'oats/response-headers-type': 'responseHeaderTypes.ts',
  'oats/response-type': 'responseTypes.ts',
  'oats/response-server-type': 'responseServerTypes.ts',
  'oats/request-type': 'requestTypes.ts',
  'oats/request-server-type': 'requestServerTypes.ts',
  'oats/path-serializer': 'pathSerializers.ts',
  'oats/query-serializer': 'querySerializers.ts',
  'oats/request-headers-serializer': 'requestHeaderSerializers.ts',
  'oats/response-headers-serializer': 'responseHeaderSerializers.ts',
  'oats/path-deserializer': 'pathDeserializers.ts',
  'oats/query-deserializer': 'queryDeserializers.ts',
  'oats/request-headers-deserializer': 'requestHeaderDeserializers.ts',
  'oats/response-headers-deserializer': 'responseHeaderDeserializers.ts',
  'oats/type-validator': 'typeValidators.ts',
  'oats/request-body-validator': 'requestBodyValidators.ts',
  'oats/response-body-validator': 'responseBodyValidators.ts',
  'oats/express-router-factory': 'expressRouterFactories.ts',
  'oats/express-router-factories-type': 'expressRouterFactoriesType.ts',
  'oats/express-app-router-factory': 'expressAppRouterFactory.ts',
  'oats/api-type': 'apiType.ts',
  'oats/sdk-impl': 'sdkImpl.ts',
  'oats/sdk-type': 'sdkType.ts',
  'oats/cookie-serializer': 'cookieSerializers.ts',
  'oats/set-cookie-serializer': 'setCookieSerializers.ts',
  'oats/cookie-deserializer': 'cookieDeserializers.ts',
  'oats/set-cookie-deserializer': 'setCookieDeserializers.ts',
  'oats/express-cors-router-factory': 'expressCorsRouterFactory.ts',
  'oats/cors-configuration': 'corsConfiguration.ts',
  'oats/express-context-handler-factory': 'expressContextHandlerFactory.ts',
}

const delegate =
  (folder: string): PathDelegate =>
  (basePath: string, input: any, target: string, helper: PathProviderHelper) =>
    resolve(join(...[basePath, ...(isNil(folder) ? [] : [folder]), `${helper.nameOf(input, target)}.ts`]))

const fullStackDelegate: DelegatingPathProviderInput = ((): DelegatingPathProviderInput => {
  const api = delegate('api')
  const sdk = delegate('sdk')
  const types = delegate('types')
  const routers = delegate('routers')
  const parameters = delegate('parameters')
  const serializers = delegate('serializers')
  const validators = delegate('validators')
  const responses = delegate('responses')
  const requests = delegate('requests')
  const typeGuards = delegate('typeGuards')
  const operations = delegate('operations')

  return {
    'oats/type': types,
    'oats/type-guard': typeGuards,

    'oats/response-type': responses,
    'oats/response-server-type': responses,

    'oats/request-type': requests,
    'oats/request-server-type': requests,

    'oats/api-type': api,

    'oats/type-validator': validators,
    'oats/response-body-validator': validators,
    'oats/request-body-validator': validators,

    'oats/request-headers-type': parameters,
    'oats/response-headers-type': parameters,
    'oats/path-type': parameters,
    'oats/query-type': parameters,
    'oats/cookies-type': parameters,

    'oats/request-headers-serializer': serializers,
    'oats/query-serializer': serializers,
    'oats/path-serializer': serializers,
    'oats/response-headers-serializer': serializers,
    'oats/cookie-serializer': serializers,
    'oats/set-cookie-serializer': serializers,

    'oats/response-headers-deserializer': serializers,
    'oats/request-headers-deserializer': serializers,
    'oats/query-deserializer': serializers,
    'oats/path-deserializer': serializers,
    'oats/cookie-deserializer': serializers,
    'oats/set-cookie-deserializer': serializers,

    'oats/operation': operations,

    'oats/cors-configuration': routers,
    'oats/express-router-factory': routers,
    'oats/express-app-router-factory': routers,
    'oats/express-router-factories-type': routers,
    'oats/express-cors-router-factory': routers,
    'oats/express-context-handler-factory': routers,
    'oats/sdk-type': sdk,
    'oats/sdk-impl': sdk,
  }
})()

export const pathProviders = {
  /**
   * Creates a path provider that provides the same fileName every input.
   * @param fileName The name of the file.
   * @returns The path provider
   */
  singleFile(fileName: string): PathProvider {
    return () => resolve(fileName)
  },

  /**
   * Creates a path provider that separates output by generator target.
   * @param folder The root folder.
   * @param fileNames (optional) An object, mapping from generator target => file name. You can overwrite default file names with this parameter.
   * @returns The path provider
   */
  byTarget(folder: string, fileNames: Partial<NameByTarget> = {}): PathProvider {
    const mergedFileNames: NameByTarget = { ...fileNameByTarget, ...fileNames }
    return (input: any, target: string, helper: PathProviderHelper) =>
      resolve(join(folder, mergedFileNames[target as OpenAPIGeneratorTarget]))
  },
  /**
   * Creates a path provider that generates each artifact into it's own file, in the input folder.
   * @param folder The root folder.
   * @returns The path provider
   */
  byName(folder: string): PathProvider {
    return (input: any, target: string, helper: PathProviderHelper) =>
      resolve(join(folder, `${helper.nameOf(input, target)}.ts`))
  },
  /**
   * Creates a default, recommended path provider. Splits files into topical hierarchy.
   * @param folder The root folder.
   * @returns The path provider
   */
  default(folder: string): PathProvider {
    return pathProviders.delegating(folder, fullStackDelegate)
  },
  /**
   * Creates a path provider, which composes the path from folder + result of the appropriate delegate
   * @param folder The root folder.
   * @param delegates The object mapping from generator target => delegate function
   * @returns The path provider.
   */
  delegating(folder: string, delegates: DelegatingPathProviderInput): PathProvider {
    return (input: any, target: string, helper: PathProviderHelper): string => {
      const delegate = delegates[target as OpenAPIGeneratorTarget]
      if (isNil(delegate)) {
        throw new TypeError(`No delegate for target "${target}".`)
      }
      const path = delegate(folder, input, target, helper)
      if (isNil(path)) {
        throw new TypeError(`Path provider delegate for "${target}" returned ${path} for ${JSON.stringify(input)}.`)
      }
      return path
    }
  },
}
