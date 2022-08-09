import { reader } from '../../reader'
import { MemoryReadContent, MemoryReaders } from '../../typings'
import { jsonParse } from '../parsers/jsonParse'
import { mixedParse } from '../parsers/mixedParse'
import { yamlParse } from '../parsers/yamlParse'
import { fileRead } from '../reads/fileRead'
import { httpRead } from '../reads/httpRead'
import { httpsRead } from '../reads/httpsRead'
import { memoryRead } from '../reads/memoryRead'
import { mixedRead } from '../reads/mixedRead'
import { fileUriSanitizer } from '../sanitizers/fileUriSanitizer'
import { httpsUriSanitizer } from '../sanitizers/httpsUriSanitizer'
import { httpUriSanitizer } from '../sanitizers/httpUriSanitizer'
import { memoryUriSanitizer } from '../sanitizers/memoryUtiSanitizer'
import { mixedUriSanitizer } from '../sanitizers/mixedUriSanitizer'

export const memoryReaders: MemoryReaders = {
  http: {
    json: (path: string, content: MemoryReadContent) =>
      reader({
        path,
        parse: jsonParse,
        read: memoryRead(httpRead, content),
        sanitize: memoryUriSanitizer(httpUriSanitizer, content),
      }),
    yaml: (path: string, content: MemoryReadContent) =>
      reader({
        path,
        parse: yamlParse,
        read: memoryRead(httpRead, content),
        sanitize: memoryUriSanitizer(httpUriSanitizer, content),
      }),
    mixed: (path: string, content: MemoryReadContent) =>
      reader({
        path,
        parse: mixedParse,
        read: memoryRead(httpRead, content),
        sanitize: memoryUriSanitizer(httpUriSanitizer, content),
      }),
  },
  https: {
    json: (path: string, content: MemoryReadContent) =>
      reader({
        path,
        parse: jsonParse,
        read: memoryRead(httpsRead, content),
        sanitize: memoryUriSanitizer(httpsUriSanitizer, content),
      }),
    yaml: (path: string, content: MemoryReadContent) =>
      reader({
        path,
        parse: yamlParse,
        read: memoryRead(httpsRead, content),
        sanitize: memoryUriSanitizer(httpsUriSanitizer, content),
      }),
    mixed: (path: string, content: MemoryReadContent) =>
      reader({
        path,
        parse: mixedParse,
        read: memoryRead(httpsRead, content),
        sanitize: memoryUriSanitizer(httpsUriSanitizer, content),
      }),
  },
  file: {
    json: (path: string, content: MemoryReadContent) =>
      reader({
        path,
        parse: jsonParse,
        read: memoryRead(fileRead, content),
        sanitize: memoryUriSanitizer(fileUriSanitizer, content),
      }),
    yaml: (path: string, content: MemoryReadContent) =>
      reader({
        path,
        parse: yamlParse,
        read: memoryRead(fileRead, content),
        sanitize: memoryUriSanitizer(fileUriSanitizer, content),
      }),
    mixed: (path: string, content: MemoryReadContent) =>
      reader({
        path,
        parse: mixedParse,
        read: memoryRead(fileRead, content),
        sanitize: memoryUriSanitizer(fileUriSanitizer, content),
      }),
  },
  mixed: {
    json: (path: string, content: MemoryReadContent) =>
      reader({
        path,
        parse: jsonParse,
        read: memoryRead(mixedRead(), content),
        sanitize: memoryUriSanitizer(mixedUriSanitizer(), content),
      }),
    yaml: (path: string, content: MemoryReadContent) =>
      reader({
        path,
        parse: yamlParse,
        read: memoryRead(mixedRead(), content),
        sanitize: memoryUriSanitizer(mixedUriSanitizer(), content),
      }),
    mixed: (path: string, content: MemoryReadContent) =>
      reader({
        path,
        parse: mixedParse,
        read: memoryRead(mixedRead(), content),
        sanitize: memoryUriSanitizer(mixedUriSanitizer(), content),
      }),
  },
}
