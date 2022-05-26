import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getAll } from './BooksAPI'

const BooksList = () => {

  const [bookshelfes, setBookshelfes] = useState([])

  useEffect(() => {
    (async () => {
      const res = await getAll()

      let booksRaw = {
        read: [],
        wantToRead: [],
        currentlyReading: [],
      }

      res.forEach((book) => {
        const bookInfo = {
          title: book.title,
          authors: book.authors.join(', '),
          imageUrl: book.imageLinks.thumbnail
        }

        switch (book.shelf) {
          case 'currentlyReading':
            booksRaw.currentlyReading.push(bookInfo);
            break;
          case 'wantToRead':
            booksRaw.wantToRead.push(bookInfo);
            break;
          case 'read':
            booksRaw.read.push(bookInfo);
            break;
          default:
        }
      })

      setBookshelfes([
        {
          category: 'Currently Reading',
          books: booksRaw.currentlyReading
        },
        {
          category: 'Want to Read',
          books: booksRaw.wantToRead
        },
        {
          category: 'Read',
          books: booksRaw.read
        },
      ])

    })()
  }, [])

  const moveToShelf = (e) => {
    const selectedCategory = e.target.value
    const selectedBookTitle = e.target.name

    const bookToMoveWithCategory = (() => {
      let bookToMove = {}
      bookshelfes.filter((bookshelf) => {
        const returnValue = bookshelf.books.filter(
          // eslint-disable-next-line array-callback-return
          (book) => {
            if (book.title === selectedBookTitle) {
              return book
            }
          },
        )

        if (returnValue.length !== 0) {
          bookToMove = returnValue[0]
        }
      })

      return {
        category: selectedCategory,
        book: bookToMove,
      }
    })()

    let updatedBookshelfes = []
    bookshelfes.filter((bookshelf) => {
      let newBooksInBookshelf = bookshelf.books.filter(
        (book) => book.title !== selectedBookTitle,
      )

      if (selectedCategory === bookshelf.category) {
        newBooksInBookshelf.push(bookToMoveWithCategory.book)
      }

      const newBookshelf = {
        category: bookshelf.category,
        books: newBooksInBookshelf,
      }
      updatedBookshelfes.push(newBookshelf)
    })

    setBookshelfes(updatedBookshelfes)
  }

  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          {bookshelfes.map((bookshelf) => (
            <div className="bookshelf" key={bookshelf.category}>
              <h2 className="bookshelf-title">{bookshelf.category}</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {bookshelf.books.map((book) => (
                    <li key={book.title}>
                      <div className="book">
                        <div className="book-top">
                          <div
                            className="book-cover"
                            style={{
                              width: 128,
                              height: 193,
                              backgroundImage: 'url(' + book.imageUrl + ')',
                            }}
                          ></div>
                          <div className="book-shelf-changer">
                            <select
                              name={book.title}
                              onChange={(e) => moveToShelf(e)}
                            >
                              <option value="no-selection">Move to...</option>
                              <option value="None">None</option>
                              <option value="Currently Reading">
                                Currently Reading
                              </option>
                              <option value="Want to Read">Want to Read</option>
                              <option value="Read">Read</option>
                            </select>
                          </div>
                        </div>
                        <div className="book-title">{book.title}</div>
                        <div className="book-authors">{book.authors}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

BooksList.propTypes = {
  bookshelfes: PropTypes.array,
}

export default BooksList
