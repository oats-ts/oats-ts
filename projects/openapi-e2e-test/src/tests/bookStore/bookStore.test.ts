import { catBook, defaultBooks, frogBook } from './bookStore.testdata'
import { testBookStoreServer } from '../servers'
import { bookstoreSdk } from '../sdks'
import { Book } from '../../generated/book-store/types'

describe('Http methods', () => {
  testBookStoreServer()

  describe('happy path', () => {
    it('should retrieve the default books', async () => {
      const response = await bookstoreSdk.getBooks({ headers: {}, query: {} })
      expect(response.body).toEqual(defaultBooks)
    })

    it('should get book by id', async () => {
      const catBookResponse = await bookstoreSdk.getBook({ path: { bookId: catBook.id } })
      expect(catBookResponse.body).toEqual(catBook)
      const frogBookResponse = await bookstoreSdk.getBook({ path: { bookId: frogBook.id } })
      expect(frogBookResponse.body).toEqual(frogBook)
    })

    it('should create a new book', async () => {
      const hippoBook: Book = {
        id: 0,
        author: 'Hippo',
        price: 200,
        title: 'The Hippo book',
      }
      const hippoBookResponse = await bookstoreSdk.addBook({
        body: hippoBook,
        mimeType: 'application/json',
      })
      expect(hippoBookResponse.body).toEqual({ ...hippoBook, id: 3 })
    })
  })
  // With the SDK we can't produce structural issues, but can do semantic issues that the server checks
  describe('issues', () => {
    it('should fail to retrieve a non-existing book', async () => {
      const catBookResponse = await bookstoreSdk.getBook({
        path: { bookId: 10 },
      })
      expect(catBookResponse.body).toEqual([{ message: '[ERROR] in "path.bookId": No book with id 10' }])
    })
  })
})
