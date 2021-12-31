import { Book } from '../../generated/BookStore'

export const frogBook: Book = {
  id: 1,
  author: 'Frog',
  bookType: 'audio',
  price: 120,
  title: 'The Frog Book',
  description: 'This is the frog book',
}

export const catBook: Book = {
  id: 2,
  author: 'Cat',
  bookType: 'paperback',
  price: 12,
  title: 'The Cat Book',
  description: 'This is the cat book',
}

export const defaultBooks: Book[] = [frogBook, catBook]
