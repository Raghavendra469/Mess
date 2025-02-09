import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const WelcomeTextWithButton = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Welcome Text Section */}
      <div className="bg-teal bg-opacity-100 p-6 rounded-lg mb-6">
        <h1 className="text-5xl font-bold text-white mb-2">
          Welcome to the Royalty Management System
        </h1>
        <p className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-4">
          A comprehensive solution to manage royalties for artists, managers,
          and administrators seamlessly.
        </p>
      </div>

      {/* Login Button Section */}
      <Link
        to="/login"
        className="bg-white text-teal-600 hover:bg-teal-600 hover:text-white px-6 py-3 rounded-xl font-semibold"
      >
        Login
      </Link>
    </div>
  );
};

export default WelcomeTextWithButton;
