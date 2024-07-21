import React, { useState } from "react";
import CreateBook from "./CreateBook";

function Books() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [books, setBooks] = useState([]);

  const handleAddBook = (newBook) => {
    console.log("New Book Added:", newBook);
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <CreateBook
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookAdded={handleAddBook}
      />
      <div className="mt-4 w-full">
        {books.length === 0 ? (
          <p className="text-center">No books available</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="border border-gray-300 rounded-md shadow-md p-6"
              >
                <h3 className="text-xl font-semibold">{book.title}</h3>
                <img
                  src={`http://localhost:5000${book.image}`}
                  alt={book.title}
                  className="mt-2 w-full h-48 object-cover p-2 border border-blue-400"
                />
                <p className="mt-2">{book.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        className="bg-blue-400 text-white py-2 px-4 rounded mt-5"
        onClick={() => setIsModalOpen(true)}
      >
        Add Book
      </button>
    </div>
  );
}

export default Books;
