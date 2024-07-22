import axios from "axios";
import React, { useEffect, useState } from "react";
import CreateBook from "./CreateBook";

function Books() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [expanded, setExpanded] = useState({});

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

  const toggleDescription = (bookId) => {
    setExpanded((prevState) => ({
      ...prevState,
      [bookId]: !prevState[bookId],
    }));
  };

  const truncateDescription = (description, isExpanded) => {
    const wordLimit = 30;
    const words = description.split(" ");
    if (isExpanded) {
      return description;
    }
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "... "
      : description;
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
              <div
                key={book._id}
                className="border border-gray-300 rounded-md shadow-md p-6"
              >
                <h3 className="text-xl font-bold uppercase">{book.title}</h3>
                <div className="flex items-end space-x-2">
                  <img
                    src={`http://localhost:5000${book.image}`}
                    alt={book.title}
                    className="mt-2 h-48 object-contain"
                  />
                  <a
                    href={`http://localhost:5000${book.pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline mt-2"
                  >
                    View PDF
                  </a>
                  <a
                    href={`http://localhost:5000/books/download/${book._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline mt-2"
                  >
                    <img
                      src="/Images/download.svg"
                      alt="Download"
                      className="w-5 mb-1"
                    />
                  </a>
                  <a
                    href="#"
                    onClick={() => handleDelete(book._id)}
                    className="text-red-500 underline ml-2 cursor-pointer"
                  >
                    Delete PDF
                  </a>
                </div>
                <p className="mt-2 text-justify tracking-tighter">
                  {truncateDescription(book.description, expanded[book._id])}
                  {book.description.split(" ").length > 50 && (
                    <span
                      onClick={() => toggleDescription(book._id)}
                      className="text-blue-500 underline cursor-pointer"
                    >
                      {expanded[book._id] ? " ...less" : "see more"}
                    </span>
                  )}
                </p>
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
