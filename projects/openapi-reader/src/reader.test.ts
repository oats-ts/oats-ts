import { isFailure, isSuccess } from '@oats-ts/try'
import EventEmitter from 'events'
import { reader } from './reader'
import { jsonParse } from './utils/parsers'
import { httpsRead } from './utils/readers'
import { httpsUriSanitizer } from './utils/sanitizers'

describe('reader', () => {
  describe('should read remote doc without refs', () => {
    it('should read schema with primitives only', async () => {
      const path = 'https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/primitive-schemas.json'
      const readerInstance = reader({
        path,
        parse: jsonParse,
        read: httpsRead,
        sanitize: httpsUriSanitizer,
      })
      const result = await readerInstance(new EventEmitter())
      expect(isSuccess(result)).toBeTruthy()
    })
    it('should read schema with primitives only', async () => {
      const path = 'https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/enum-schemas.json'
      const readerInstance = reader({
        path,
        parse: jsonParse,
        read: httpsRead,
        sanitize: httpsUriSanitizer,
      })
      const result = await readerInstance(new EventEmitter())
      expect(isSuccess(result)).toBeTruthy()
    })
    it('should read kitchen sink schema', async () => {
      const path = 'https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/book-store.json'
      const readerInstance = reader({
        path,
        parse: jsonParse,
        read: httpsRead,
        sanitize: httpsUriSanitizer,
      })
      const result = await readerInstance(new EventEmitter())
      expect(isSuccess(result)).toBeTruthy()
    })
  })
  describe('should read remote doc with refs', () => {
    it('should read schemay with local and remote refs', async () => {
      const path = 'https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/references.json'
      const readerInstance = reader({
        path,
        parse: jsonParse,
        read: httpsRead,
        sanitize: httpsUriSanitizer,
      })
      const result = await readerInstance(new EventEmitter())
      if (!isSuccess(result)) {
        fail()
      }
      expect(result.data.documents.size).toBeGreaterThan(1)
    })
  })
  it('should fail to read remote doc with bad uri', async () => {
    const path = 'https://frog.com/cat'
    const readerInstance = reader({
      path,
      parse: jsonParse,
      read: httpsRead,
      sanitize: httpsUriSanitizer,
    })
    const result = await readerInstance(new EventEmitter())
    expect(isFailure(result)).toBeTruthy()
  })

  describe('events', () => {
    // TODO test order of emits
  })
})
