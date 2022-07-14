import { ContentReader } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { success, Try } from '@oats-ts/try'
import { isNil } from 'lodash'
import { reader } from './reader'
import { OpenAPIReadOutput, SchemeConfig, TestReaderConfig } from './typings'

export function testReader(
  config: TestReaderConfig,
  sanitizerFactory: (config: SchemeConfig, uriOnly: boolean) => (path: string) => Try<string>,
  readFactory: (config: SchemeConfig) => (uri: string) => Promise<Try<string>>,
  parse: (uri: string, input: string) => Promise<Try<OpenAPIObject>>,
): ContentReader<OpenAPIObject, OpenAPIReadOutput> {
  const delegate = readFactory({
    file: Boolean(config.fileRefs),
    http: Boolean(config.httpRefs),
    https: Boolean(config.httpsRefs),
  })

  return reader({
    path: config.path,
    parse,
    sanitize: sanitizerFactory(
      {
        file: Boolean(config.fileRefs),
        http: Boolean(config.httpRefs),
        https: Boolean(config.httpsRefs),
      },
      true,
    ),
    read: async (uri: string): Promise<Try<string>> => {
      if (config.content.has(uri) && !isNil(config.content.get(uri))) {
        return success(config.content.get(uri)!)
      }
      return delegate(uri)
    },
  })
}
