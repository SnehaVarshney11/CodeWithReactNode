import React from "react";
import "../index.css";

function Home() {
  return (
    <div className="relative">
      <img
        src="Images/bg.svg"
        alt="Background"
        className="w-full max-h-[92.2vh] object-cover"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 text-center">
        <h1 className="text-2xl font-bold uppercase">
          Welcome to Book Library
        </h1>
        <h3>Explore a world of books and stories.</h3>
        <p className="text-xs">Grab A Book To Read</p>
        <a href="/books">
          <button className="bg-blue-400 text-white px-4 py-2 rounded">
            Explore Book
          </button>
        </a>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-white py-8 text-center">
        <h2 className="text-xl font-semibold">About Us</h2>
        <p className="mt-2 px-4 text-sm">
          At Book Library, we believe in the power of stories to transform
          lives. Our collection features a diverse range of books from various
          genres, offering something for every reader. Whether you're looking
          for inspiration, adventure, or a cozy read, you'll find it here. Join
          us in exploring the world of literature and discovering your next
          great read!
        </p>
      </div>
    </div>
  );
}

export default Home;
