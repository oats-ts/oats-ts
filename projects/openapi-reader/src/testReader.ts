import { ContentReader } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { success, Try } from '@oats-ts/try'
import { isNil } from 'lodash'
import { reader } from './reader'
import { OpenAPIReadOutput, TestReaderConfig } from './typings'
import { mixedRead } from './utils/reads/mixedRead'
import { mixedUriSanitizer } from './utils/sanitizers/mixedUriSanitizer'

function testSanitizer(config: TestReaderConfig) {
  return mixedUriSanitizer(
    {
      file: Boolean(config.fileRefs),
      http: Boolean(config.httpRefs),
      https: Boolean(config.httpsRefs),
    },
    true,
  )
}

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
