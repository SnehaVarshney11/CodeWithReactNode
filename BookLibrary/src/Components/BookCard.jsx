import React, { useState } from "react";

const BookCard = ({ book, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleDescription = () => {
    setExpanded(!expanded);
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

  return (
    <div className="border border-gray-300 rounded-md shadow-md p-6">
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
          <img src="/Images/download.svg" alt="Download" className="w-5 mb-1" />
        </a>
        <a
          href="#"
          onClick={() => onDelete(book._id)}
          className="text-red-500 underline ml-2 cursor-pointer"
        >
          Delete PDF
        </a>
      </div>
      <p className="mt-2 text-justify tracking-tighter">
        {truncateDescription(book.description, expanded)}
        {book.description.split(" ").length > 50 && (
          <span
            onClick={toggleDescription}
            className="text-blue-500 underline cursor-pointer"
          >
            {expanded ? " ...less" : "see more"}
          </span>
        )}
      </p>
    </div>
  );
};

export default BookCard;
