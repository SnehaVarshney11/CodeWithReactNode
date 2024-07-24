import axios from "axios";
import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import CreateBook from "./CreateBook";

function Books() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [books, setBooks] = useState([]);

  // After reloading the page, books will be shown
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/books");
        setBooks(res.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  const handleAddBook = (newBook) => {
    console.log("New Book Added:", newBook);
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  const handleDelete = async (id) => {
    console.log("Deleting book with ID:", id);

    if (!id) {
      console.error("ID is not defined");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Response was not ok");
      }

      const data = await response.json();
      console.log(data.message);

      // Remove the deleted book from state
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
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
              <BookCard key={book._id} book={book} onDelete={handleDelete} />
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
