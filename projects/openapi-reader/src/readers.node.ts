import { reader } from './reader'
import { testReader } from './testReader'
import { Readers, TestReaderConfig } from './typings'
import { jsonParse } from './utils/parsers/jsonParse'
import { mixedParse } from './utils/parsers/mixedParse'
import { yamlParse } from './utils/parsers/yamlParse'
import { fileRead } from './utils/reads/fileRead.node'
import { httpRead } from './utils/reads/httpRead'
import { httpsRead } from './utils/reads/httpsRead'
import { mixedRead } from './utils/reads/mixedRead'
import { fileUriSanitizer } from './utils/sanitizers/fileUriSanitizer'
import { httpsUriSanitizer } from './utils/sanitizers/httpsUriSanitizer'
import { httpUriSanitizer } from './utils/sanitizers/httpUriSanitizer'
import { mixedUriSanitizer } from './utils/sanitizers/mixedUriSanitizer'
import { sanitizePath } from './utils/sanitizers/sanitizePath.node'

export const readers: Readers = {
  custom: reader,
  test: {
    json: (config: TestReaderConfig) =>
      testReader(config, mixedUriSanitizer(sanitizePath), mixedRead(fileRead), jsonParse),
    yaml: (config: TestReaderConfig) =>
      testReader(config, mixedUriSanitizer(sanitizePath), mixedRead(fileRead), yamlParse),
    mixed: (config: TestReaderConfig) =>
      testReader(config, mixedUriSanitizer(sanitizePath), mixedRead(fileRead), mixedParse),
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
    json: (path: string) =>
      reader({ path, parse: jsonParse, read: fileRead, sanitize: fileUriSanitizer(sanitizePath) }),
    yaml: (path: string) =>
      reader({ path, parse: yamlParse, read: fileRead, sanitize: fileUriSanitizer(sanitizePath) }),
    mixed: (path: string) =>
      reader({ path, parse: mixedParse, read: fileRead, sanitize: fileUriSanitizer(sanitizePath) }),
  },
  mixed: {
    json: (path: string) =>
      reader({ path, parse: jsonParse, read: mixedRead(fileRead)(), sanitize: mixedUriSanitizer(sanitizePath)() }),
    yaml: (path: string) =>
      reader({ path, parse: yamlParse, read: mixedRead(fileRead)(), sanitize: mixedUriSanitizer(sanitizePath)() }),
    mixed: (path: string) =>
      reader({ path, parse: mixedParse, read: mixedRead(fileRead)(), sanitize: mixedUriSanitizer(sanitizePath)() }),
  },
}
