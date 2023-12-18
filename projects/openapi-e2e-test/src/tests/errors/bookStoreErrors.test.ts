import { BookStoreFetchClientAdapter } from './BookStoreFetchClientAdapter'
import { PATH } from '../constants'
import { BookStoreSdkImpl } from '../../generated/book-store/sdkImpl'
import { defaultBooks } from '../bookStore/bookStore.testdata'

import { testExpressServer } from '../../testExpressServer'
import { customBodyParsers } from '../common/customBodyParsers'
import { PORT } from '../constants'
import { bookStoreErrorRouter } from './bookStoreErrorRouter'

describe('Book store with errors', () => {
  testExpressServer({
    port: PORT,
    runBeforeAndAfter: 'each',
    attachHandlers: (router) => {
      router.use(customBodyParsers.json())
      router.use(bookStoreErrorRouter)
    },
  })

  it('should complain about the unexpected status code', async () => {
    const adapter = new BookStoreFetchClientAdapter({ url: PATH })
    const bookstoreSdk = new BookStoreSdkImpl(adapter)

    const response = await bookstoreSdk.addBook({
      mimeType: 'application/json',
      body: { author: 'a', id: -1, title: 'Asd', price: 1 },
    })
    expect(response.body).toEqual(defaultBooks[0])
    expect(adapter.issues).toHaveLength(1)
    const issue = adapter.issues[0]!
    expect(issue.path).toBe('statusCode')
  })

  it('should complain about the unexpected mime-type', async () => {
    const adapter = new BookStoreFetchClientAdapter({ url: PATH })
    const bookstoreSdk = new BookStoreSdkImpl(adapter)

    const response = await bookstoreSdk.getBook({ path: { bookId: 1 } })

    // Since we don't know the mime type, the adapter can't parse the response, and this data is garbage
    expect(response.body).toEqual(JSON.stringify(defaultBooks[0]))
    expect(adapter.issues).toHaveLength(1)

    const issue = adapter.issues[0]!
    expect(issue.path).toBe('headers["content-type"]')
  })

  it('should complain about the unexpected response body and headers shape', async () => {
    const adapter = new BookStoreFetchClientAdapter({ url: PATH })
    const bookstoreSdk = new BookStoreSdkImpl(adapter)
    const response = await bookstoreSdk.getBooks({})

    expect(response.body).toEqual({ foo: 'hi' })
    expect(adapter.issues).toHaveLength(2)

    const headerIssue = adapter.issues[0]!
    expect(headerIssue.path).toBe('headers["x-length"]')

    const bodyIssue = adapter.issues[1]!
    expect(bodyIssue.path).toBe('responseBody')
  })
})
