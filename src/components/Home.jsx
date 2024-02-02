import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <h1 className="text-5xl font-extrabold text-center text-gray-200 mt-16">
        Resoluter Test
      </h1>
      <div className="flex flex-col items-center justify-center mb-16 h-screen bg-gray-900">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-200">
          Welcome to the Quiz Challenge!
        </h1>
        <p className="text-lg text-center text-gray-300 mb-8">
          Test your knowledge with our exciting quiz. You have 1 minute to
          answer each question. Choose your options carefully!
        </p>
        <Link to="/quiz">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
            Start Quiz
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
