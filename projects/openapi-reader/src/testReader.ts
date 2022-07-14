import { ContentReader } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { success, Try } from '@oats-ts/try'
import { isNil } from 'lodash'
import { reader } from './reader'
import { OpenAPIReadOutput, TestReaderConfig } from './typings'
import { mixedRead } from './utils/reads'
import { mixedUriSanitizer } from './utils/sanitizers'

const testRead = (config: TestReaderConfig) => {
  const delegate = mixedRead({
    file: Boolean(config.fileRefs),
    http: Boolean(config.httpRefs),
    https: Boolean(config.httpsRefs),
  })
  return async (uri: string): Promise<Try<string>> => {
    if (config.content.has(uri) && !isNil(config.content.get(uri))) {
      return success(config.content.get(uri)!)
    }
    return delegate(uri)
  }
}

const testUriSanitizer = (config: TestReaderConfig) =>
  mixedUriSanitizer(
    {
      file: Boolean(config.fileRefs),
      http: Boolean(config.httpRefs),
      https: Boolean(config.httpsRefs),
    },
    true,
  )

export function testReader(
  config: TestReaderConfig,
  parse: (uri: string, input: string) => Promise<Try<OpenAPIObject>>,
): ContentReader<OpenAPIObject, OpenAPIReadOutput> {
  return reader({
    path: config.path,
    parse,
    sanitize: testUriSanitizer(config),
    read: testRead(config),
  })
}
