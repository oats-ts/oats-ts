import { ContentReader } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { success, Try } from '@oats-ts/try'
import { isNil, has } from 'lodash'
import { reader } from './reader'
import { OpenAPIReadOutput, TestReaderConfig } from './typings'
import { mixedRead } from './utils/reads/mixedRead'
import { mixedUriSanitizer } from './utils/sanitizers/mixedUriSanitizer'

function testSanitizer(config: TestReaderConfig): (path: string) => Promise<Try<string>> {
  const delegate = mixedUriSanitizer(
    {
      file: Boolean(config.fileRefs),
      http: Boolean(config.httpRefs),
      https: Boolean(config.httpsRefs),
    },
    true,
  )
  return async (path: string): Promise<Try<string>> => {
    if (has(config.content, path) && !isNil(config.content[path])) {
      return success(path)
    }
    return delegate(path)
  }
}

function testRead(config: TestReaderConfig): (path: string) => Promise<Try<string>> {
  const delegate = mixedRead({
    file: Boolean(config.fileRefs),
    http: Boolean(config.httpRefs),
    https: Boolean(config.httpsRefs),
  })
  return async (uri: string): Promise<Try<string>> => {
    if (has(config.content, uri) && !isNil(config.content[uri])) {
      return success(config.content[uri]!)
    }
    return delegate(uri)
  }
}

export function testReader(
  config: TestReaderConfig,
  parse: (uri: string, input: string) => Promise<Try<OpenAPIObject>>,
): ContentReader<OpenAPIObject, OpenAPIReadOutput> {
  return reader({
    path: config.path,
    parse,
    sanitize: testSanitizer(config),
    read: testRead(config),
  })
}
