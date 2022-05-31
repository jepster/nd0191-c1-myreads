import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {getAll, update} from "./BooksAPI";
import PropTypes from "prop-types";
import BooksList from "./BooksList";

const Search = () => {
  let navigate = useNavigate()

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
          imageUrl: book.imageLinks.thumbnail,
          id: book.id,
          isbnNumbers: ((book) => {
            const isbnNumbersRaw = []
            book.industryIdentifiers.forEach((industryIdentifier) => {
              isbnNumbersRaw.push(industryIdentifier.identifier)
            })
            return isbnNumbersRaw.join(', ')
          })(book),
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
    const selectedBookId = e.target.name

    const bookToMoveWithCategory = (() => {
      let bookToMove = {}
      bookshelfes.filter((bookshelf) => {
        const returnValue = bookshelf.books.filter(
          // eslint-disable-next-line array-callback-return
          (book) => {
            if (book.id === selectedBookId) {
              return book
            }
          },
        )

        if (returnValue.length !== 0) {
          bookToMove = returnValue[0]
        }
      })

      switch (selectedCategory) {
        case 'Currently Reading':
          update(bookToMove, 'currentlyReading');
          break;
        case 'Want to Read':
          update(bookToMove, 'wantToRead');
          break;
        case 'Read':
          update(bookToMove, 'read');
          break;
      }

      return {
        category: selectedCategory,
        book: bookToMove,
      }
    })()

    let updatedBookshelfes = []
    bookshelfes.filter((bookshelf) => {
      let newBooksInBookshelf = bookshelf.books.filter(
        (book) => book.id !== selectedBookId,
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

  const handleChange = async (event) => {
    const searchString = event.target.value.toLowerCase()

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
        imageUrl: book.imageLinks.thumbnail,
        id: book.id,
        isbnNumbers: ((book) => {
          const isbnNumbersRaw = []
          book.industryIdentifiers.forEach((industryIdentifier) => {
            isbnNumbersRaw.push(industryIdentifier.identifier)
          })
          return isbnNumbersRaw.join(', ')
        })(book),
      }

      let match = false

      if (bookInfo.title.toLowerCase().includes(searchString)) {
        match = true
      }

      if (match === false && bookInfo.authors.toLowerCase().includes(searchString)) {
        match = true
      }

      if (match === false && bookInfo.isbnNumbers.toLowerCase().includes(searchString)) {
        match = true
      }

      if (match) {
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
  }

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <a className="close-search" onClick={() => navigate('/')}>
          Close
        </a>
        <div className="search-books-input-wrapper">
          <input onChange={handleChange} type="text" placeholder="Search by title, author, or ISBN" />
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {bookshelfes.map((bookshelf) => (
            <div className="bookshelf" key={bookshelf.category}>
              <h2 className="bookshelf-title">{bookshelf.category}</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {bookshelf.books.map((book) => (
                    <li key={book.id}>
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
                              name={book.id}
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
        </ol>
      </div>
    </div>
  )
}

Search.propTypes = {
  bookshelfes: PropTypes.array,
}

export default Search
