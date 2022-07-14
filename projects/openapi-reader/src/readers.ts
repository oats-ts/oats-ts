import { reader } from './reader'
import { testReader } from './testReader'
import { TestReaderConfig } from './typings'
import { jsonParse, mixedParse, yamlParse } from './utils/parsers'
import { fileRead, httpRead, httpsRead, mixedRead } from './utils/reads'
import { fileUriSanitizer, httpsUriSanitizer, httpUriSanitizer, mixedUriSanitizer } from './utils/sanitizers'

export const readers = {
  custom: reader,
  test: {
    json: (config: TestReaderConfig) => testReader(config, jsonParse),
    yaml: (config: TestReaderConfig) => testReader(config, yamlParse),
    mixed: (config: TestReaderConfig) => testReader(config, mixedParse),
  },
  http: {
    json: (path: string) => reader({ path, parse: jsonParse, read: httpRead, sanitize: httpUriSanitizer }),
    yaml: (path: string) => reader({ path, parse: yamlParse, read: httpRead, sanitize: httpUriSanitizer }),
    mixed: (path: string) => reader({ path, parse: mixedParse, read: httpRead, sanitize: httpUriSanitizer }),
  },
  https: {
    json: (path: string) => reader({ path, parse: jsonParse, read: httpsRead, sanitize: httpsUriSanitizer }),
    yaml: (path: string) => reader({ path, parse: yamlParse, read: httpsRead, sanitize: httpsUriSanitizer }),
    mixed: (path: string) => reader({ path, parse: mixedParse, read: httpsRead, sanitize: httpsUriSanitizer }),
  },
  file: {
    json: (path: string) => reader({ path, parse: jsonParse, read: fileRead, sanitize: fileUriSanitizer }),
    yaml: (path: string) => reader({ path, parse: yamlParse, read: fileRead, sanitize: fileUriSanitizer }),
    mixed: (path: string) => reader({ path, parse: mixedParse, read: fileRead, sanitize: fileUriSanitizer }),
  },
  mixed: {
    json: (path: string) => reader({ path, parse: jsonParse, read: mixedRead(), sanitize: mixedUriSanitizer() }),
    yaml: (path: string) => reader({ path, parse: yamlParse, read: mixedRead(), sanitize: mixedUriSanitizer() }),
    mixed: (path: string) => reader({ path, parse: mixedParse, read: mixedRead(), sanitize: mixedUriSanitizer() }),
  },
} as const
