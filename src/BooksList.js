import { useState } from 'react'
import PropTypes from 'prop-types'

const BooksList = () => {
  const [bookshelfes, setBookshelfes] = useState([
    {
      category: 'Currently Reading',
      books: [
        {
          title: 'To Kill a Mockingbird',
          authors: 'Harper Lee',
          imageUrl:
            'url("http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api")',
        },
        {
          title: "Ender's Game",
          authors: 'Orson Scott Card',
          imageUrl:
            'url("http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72RRiTR6U5OUg3IY_LpHTL2NztVWAuZYNFE8dUuC0VlYabeyegLzpAnDPeWxE6RHi0C2ehrR9Gv20LH2dtjpbcUcs8YnH5VCCAH0Y2ICaKOTvrZTCObQbsfp4UbDqQyGISCZfGN&source=gbs_api")',
        },
      ],
    },
    {
      category: 'Want to Read',
      books: [
        {
          title: '1776',
          authors: 'David McCullough',
          imageUrl:
            'url("http://books.google.com/books/content?id=uu1mC6zWNTwC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73pGHfBNSsJG9Y8kRBpmLUft9O4BfItHioHolWNKOdLavw-SLcXADy3CPAfJ0_qMb18RmCa7Ds1cTdpM3dxAGJs8zfCfm8c6ggBIjzKT7XR5FIB53HHOhnsT7a0Cc-PpneWq9zX&source=gbs_api")',
        },
        {
          title: "Harry Potter and the Sorcerer's Stone",
          authors: 'J.K. Rowling',
          imageUrl:
            'url("http://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72G3gA5A-Ka8XjOZGDFLAoUeMQBqZ9y-LCspZ2dzJTugcOcJ4C7FP0tDA8s1h9f480ISXuvYhA_ZpdvRArUL-mZyD4WW7CHyEqHYq9D3kGnrZCNiqxSRhry8TiFDCMWP61ujflB&source=gbs_api")',
        },
      ],
    },
    {
      category: 'Read',
      books: [
        {
          title: 'The Hobbit',
          authors: 'J.R.R. Tolkien',
          imageUrl:
            'url("http://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70Rw0CCwNZh0SsYpQTkMbvz23npqWeUoJvVbi_gXla2m2ie_ReMWPl0xoU8Quy9fk0Zhb3szmwe8cTe4k7DAbfQ45FEzr9T7Lk0XhVpEPBvwUAztOBJ6Y0QPZylo4VbB7K5iRSk&source=gbs_api")',
        },
        {
          title: 'The Adventures of Tom Sawyer',
          authors: 'Mark Twain',
          imageUrl:
            'url("http://books.google.com/books/content?id=32haAAAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72yckZ5f5bDFVIf7BGPbjA0KYYtlQ__nWB-hI_YZmZ-fScYwFy4O_fWOcPwf-pgv3pPQNJP_sT5J_xOUciD8WaKmevh1rUR-1jk7g1aCD_KeJaOpjVu0cm_11BBIUXdxbFkVMdi&source=gbs_api")',
        },
      ],
    },
  ])

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
                              backgroundImage: book.imageUrl,
                            }}
                          ></div>
                          <div className="book-shelf-changer">
                            <select
                              name={book.title}
                              onChange={(e) => moveToShelf(e)}
                            >
                              <option value="none" disabled>
                                Move to...
                              </option>
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
