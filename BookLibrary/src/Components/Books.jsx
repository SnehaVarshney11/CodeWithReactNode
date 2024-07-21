import React, { useState } from "react";
import CreateBook from "./CreateBook";

function Books() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [books, setBooks] = useState([]);

  const handleAddBook = (newBook) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <button
        className="bg-blue-400 text-white py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Add Book
      </button>
      <CreateBook
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookAdded={handleAddBook}
      />
      <div className="mt-4">
        {books.map((book) => (
          <div key={book._id} className="mb-4">
            <h3 className="text-xl font-semibold">{book.title}</h3>
            <img src={book.image} alt={book.title} className="mt-2" />
            <p className="mt-2">{book.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;
