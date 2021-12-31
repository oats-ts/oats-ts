import { NodeFetchClientConfiguration } from '@oats-ts/openapi-http-client/lib/node-fetch'
import { ExpressServerConfiguration } from '@oats-ts/openapi-http-server/lib/express'
import { BookStoreApiImpl } from './BookStoreApiImpl'
import { useExpressServer } from '@oats-ts/openapi-test-utils'
import { customBodyParsers } from '../common/customBodyParsers'
import { Book, BookStoreClientSdk, createBookStoreRouter } from '../../generated/BookStore'
import { catBook, defaultBooks, frogBook } from './bookStore.testdata'

describe('Http methods', () => {
  useExpressServer({
    port: 3333,
    runBeforeAndAfter: 'each',
    handlers: [
      customBodyParsers.json(),
      createBookStoreRouter(new BookStoreApiImpl(), new ExpressServerConfiguration()),
    ],
  })
  const sdk = new BookStoreClientSdk(new NodeFetchClientConfiguration('http://localhost:3333'))

  describe('happy path', () => {
    it('should retrieve the default books', async () => {
      const response = await sdk.getBooks()
      expect(response.body).toEqual(defaultBooks)
    })

    it('should get book by id', async () => {
      const catBookResponse = await sdk.getBook({ path: { bookId: catBook.id } })
      expect(catBookResponse.body).toEqual(catBook)
      const frogBookResponse = await sdk.getBook({ path: { bookId: frogBook.id } })
      expect(frogBookResponse.body).toEqual(frogBook)
    })

    it('should create a new book', async () => {
      const hippoBook: Book = {
        id: 0,
        author: 'Hippo',
        bookType: 'digital',
        price: 200,
        title: 'The Hippo book',
      }
      const hippoBookResponse = await sdk.createBook({
        body: hippoBook,
        mimeType: 'application/json',
      })
      expect(hippoBookResponse.body).toEqual({ ...hippoBook, id: 3 })
    })

    it('should update an existing book', async () => {
      const updatedCatBook: Book = {
        ...catBook,
        title: 'Dog book',
      }
      const catBookResponse = await sdk.updateBook({
        path: { bookId: catBook.id },
        body: updatedCatBook,
        mimeType: 'application/json',
      })
      expect(catBookResponse.body).toEqual(updatedCatBook)
    })
  })
  // With the SDK we can't produce structural issues, but can do semantic issues that the server checks
  describe('issues', () => {
    it('should fail to retrieve a non-existing book', async () => {
      const catBookResponse = await sdk.getBook({
        path: { bookId: 10 },
      })
      expect(catBookResponse.body).toEqual([{ message: '[ERROR] in "path.bookId": No book with id 10' }])
    })
  })
})
