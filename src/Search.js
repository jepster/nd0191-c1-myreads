import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {getAll, search, update, get} from "./BooksAPI";
import PropTypes from "prop-types";

const Search = () => {
  let navigate = useNavigate()

  const [bookshelfes, setBookshelfes] = useState([])
  const [searchResults, setSearchResults] = useState([])

  async function updateBookshelfes() {
    const res = await getAll()

    let booksRaw = {
      read: [],
      wantToRead: [],
      currentlyReading: [],
    }

    res.forEach((book) => {
      const bookInfo = {
        title: book.title,
        authors: ((authors) => {
          if (Array.isArray(authors) && authors.length > 0) {
            return authors.join(', ')
          }
          return authors
        })(book.authors),
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
          booksRaw.currentlyReading.push(bookInfo)
          break
        case 'wantToRead':
          booksRaw.wantToRead.push(bookInfo)
          break
        case 'read':
          booksRaw.read.push(bookInfo)
          break
      }
    })

    setBookshelfes([
      {
        category: 'Currently Reading',
        books: booksRaw.currentlyReading,
      },
      {
        category: 'Want to Read',
        books: booksRaw.wantToRead,
      },
      {
        category: 'Read',
        books: booksRaw.read,
      },
    ])
  }

  useEffect(() => {
    (async () => {
      await updateBookshelfes()
    })()
  }, [])

  const moveToShelf = async (e) => {
    const selectedCategory = e.target.value
    const selectedBookId = e.target.name

    let bookToMove = {}

    const bookRetrieved = await get(selectedBookId)

    if (bookRetrieved.length !== 0) {
      bookToMove = bookRetrieved

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

      (async () => {
        await updateBookshelfes()
      })()
    }

  }

  const handleChange = async (event) => {
    const searchString = event.target.value.toLowerCase()

    if (searchString.length < 3) {
      return;
    }

    const res = await search(searchString)

    let books = []

    if (res.length > 0) {
      res.forEach((book) => {

        const bookInfo = {
          title: book.title,
          authors: ((authors) => {
            if (Array.isArray(authors) && authors.length > 0) {
              return authors.join(', ')
            }
            return authors
          })(book.authors),
          imageUrl: book.imageLinks.thumbnail,
          id: book.id,
        }

        books.push(bookInfo);
      })
    }


    setSearchResults(books)
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


      <div className="search-books-results">
        <h2>Search results</h2>


        {searchResults.length > 0 ?

        <ol className="books-grid">
          <ol className="books-grid">
            {searchResults.map((book) => (
              <li key={book.id + book.title}>
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
        </ol>
       : 'Type into the search field to get search results.' }
      </div>
    </div>
  )
}

Search.propTypes = {
  bookshelfes: PropTypes.array,
}

export default Search
