import { Book } from '../../generated/book-store'

export const frogBook: Book = {
  id: 1,
  author: 'Frog',
  price: 120,
  title: 'The Frog Book',
  description: 'This is the frog book',
}

export const catBook: Book = {
  id: 2,
  author: 'Cat',
  price: 12,
  title: 'The Cat Book',
  description: 'This is the cat book',
}

export const defaultBooks: Book[] = [frogBook, catBook]
