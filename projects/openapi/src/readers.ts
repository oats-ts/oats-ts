import { ContentReader } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import {
  reader,
  fileRead,
  fileUriSanitizer,
  httpRead,
  httpsRead,
  httpsUriSanitizer,
  httpUriSanitizer,
  mixedUriSanitizer,
  jsonParse,
  mixedParse,
  mixedRead,
  yamlParse,
  OpenAPIReadOutput,
} from '@oats-ts/openapi-reader'

type SimplifiedReader = (path: string) => ContentReader<OpenAPIObject, OpenAPIReadOutput>

type SimplifiedReadersForProtocol = {
  readonly json: SimplifiedReader
  readonly yaml: SimplifiedReader
  readonly mixed: SimplifiedReader
}

type SimplfiedReaders = {
  readonly custom: typeof reader
  readonly http: SimplifiedReadersForProtocol
  readonly https: SimplifiedReadersForProtocol
  readonly file: SimplifiedReadersForProtocol
  readonly mixed: SimplifiedReadersForProtocol
}

export const readers: SimplfiedReaders = {
  custom: reader,
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
    json: (path: string) => reader({ path, parse: jsonParse, read: mixedRead, sanitize: mixedUriSanitizer }),
    yaml: (path: string) => reader({ path, parse: yamlParse, read: mixedRead, sanitize: mixedUriSanitizer }),
    mixed: (path: string) => reader({ path, parse: mixedParse, read: mixedRead, sanitize: mixedUriSanitizer }),
  },
} as const
