import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "./BookCard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = useQuery();
  const title = query.get("title");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let response;
        if (title) {
          response = await axios.get(
            `http://localhost:5000/books/search?title=${title}`
          );
        } else {
          response = await axios.get("http://localhost:5000/books");
        }
        setBooks(response.data);
      } catch (err) {
        setError(err.response ? err.response.data : "Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [title]);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error.message || "Error occurred"}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
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
    </div>
  );
};

export default SearchResults;
