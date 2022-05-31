import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {getAll} from "./BooksAPI";

const Search = () => {
  let navigate = useNavigate()

  const [books, setBooks] = useState([])

  async function fetchAllBooks() {
    const res = await getAll()

    const booksRaw = []

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

      booksRaw.push(bookInfo)
    })
    return booksRaw
  }

  useEffect(() => {
    (async () => {
      const booksRaw = await fetchAllBooks()

      setBooks(booksRaw)
    })()
  }, [])

  const handleChange = async (event) => {
    const searchString = event.target.value.toLowerCase()

    let booksRaw = await fetchAllBooks()

    booksRaw = booksRaw.filter((book) => {
      let match = false

      if (book.title.toLowerCase().includes(searchString)) {
        match = true
      }

      if (match === false && book.authors.toLowerCase().includes(searchString)) {
        match = true
      }

      if (match === false && book.isbnNumbers.toLowerCase().includes(searchString)) {
        match = true
      }

      return match
    })

    setBooks(booksRaw)
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
          {books.map((book) => (
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
                </div>
                <div className="book-title">{book.title}</div>
                <div className="book-authors">{book.authors}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default Search
