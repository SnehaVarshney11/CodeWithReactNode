import React from "react";
import "../index.css";

function NavBar() {
  return (
    <div className="bg-black py-2 flex items-center px-5">
      <h3 className="text-xl uppercase text-white mr-auto">Book Library</h3>
      <input className="rounded outline-none p-1" placeholder="Search a Book" />
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
