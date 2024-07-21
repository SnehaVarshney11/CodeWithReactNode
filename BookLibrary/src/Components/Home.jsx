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
      <div className="absolute inset-0 flex flex-col items-center mt-10 space-y-3">
        <h1 className="text-2xl font-bold uppercase">
          Welcome to Book Library
        </h1>
        <h3>Explore a world of books and stories.</h3>
        <p className="text-xs">Grab A Book To Read</p>
        <button className="bg-blue-400">Explore Book</button>
      </div>
    </div>
  );
}

export default Home;
