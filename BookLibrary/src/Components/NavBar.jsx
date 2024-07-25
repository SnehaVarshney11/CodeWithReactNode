import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function NavBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Hook replace by useHistory, navigate back to previous pages we will use the React useNavigation Hook

  const handleSearch = (e) => {
    e.preventDefault(); //When a form is submitted, the default behavior is for the page to reload. By using e.preventDefault(), you can prevent this
    if (searchQuery) {
      navigate(`/books/search?title=${searchQuery}`);
    } else {
      navigate(`/books`);
    }
  };

  return (
    <div className="bg-black py-2 flex items-center px-5">
      <h3 className="text-xl uppercase text-white mr-auto">Book Library</h3>
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          className="rounded outline-none p-1"
          placeholder="Search a Book"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="ml-2 bg-blue-400 text-white py-1 px-2 rounded"
        >
          Search
        </button>
      </form>
      <div className="ml-auto">
        <ul className="uppercase flex space-x-5 text-white">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/books">Books</a>
          </li>
          <li>
            <a href="#">LogIn</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavBar;
