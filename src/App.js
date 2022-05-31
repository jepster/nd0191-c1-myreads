import "./App.css";
// import { useState } from "react";
import BooksList from "./BooksList";
import {Route, Routes, useNavigate} from "react-router-dom";
import Search from './Search';

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
          <Search/>
        }
      />
    </Routes>
  );
}

export default App;
