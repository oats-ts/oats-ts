import { reader } from '../../reader'
import { DefaultReaders } from '../../typings'
import { jsonParse } from '../parsers/jsonParse'
import { mixedParse } from '../parsers/mixedParse'
import { yamlParse } from '../parsers/yamlParse'
import { fileRead } from '../reads/fileRead'
import { httpRead } from '../reads/httpRead'
import { httpsRead } from '../reads/httpsRead'
import { mixedRead } from '../reads/mixedRead'
import { fileUriSanitizer } from '../sanitizers/fileUriSanitizer'
import { httpsUriSanitizer } from '../sanitizers/httpsUriSanitizer'
import { httpUriSanitizer } from '../sanitizers/httpUriSanitizer'
import { mixedUriSanitizer } from '../sanitizers/mixedUriSanitizer'

export const defaultReaders: DefaultReaders = {
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
}
