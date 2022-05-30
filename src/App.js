import "./App.css";
// import { useState } from "react";
import BooksList from "./BooksList";
import { Route, Routes, useNavigate } from "react-router-dom";

function App() {
  let navigate = useNavigate();

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <div>
            <BooksList/>
            <div className="open-search">
              <a onClick={() => navigate('/search')}>Add a book</a>
            </div>
          </div>
        }
      />
      <Route
        exact
        path="/search"
        element={
          <div className="search-books">
            <div className="search-books-bar">
              <a
                className="close-search"
                onClick={() => navigate('/')}
              >
                Close
              </a>
              <div className="search-books-input-wrapper">
                <input
                  type="text"
                  placeholder="Search by title, author, or ISBN"
                />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
