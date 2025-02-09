import React from "react";
import { Link } from "react-router-dom";
 
const HomePage = () => {
  return (
        <div className="min-h-screen bg-teal-500 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-lg">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <div className="text-teal-600 text-2xl font-bold">
                        Royalty Management
                    </div>
                    {/* Links */}
                    <div className="space-x-6">
                        <Link
                        to="/login"
                        className="text-teal-600 hover:text-teal-800 font-semibold"
                        >
                        Login
                        </Link>
                        {/* <Link
                        to="/register"
                        className="text-teal-600 hover:text-teal-800 font-semibold"
                        >
                        Register
                        </Link> */}
                    </div>
                </div>
            </nav>

        {/* Hero Section */}
        <div className="flex-grow flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to the Royalty Management System
            </h1>
            <p className="text-white text-lg md:text-xl max-w-3xl mb-8">
            A comprehensive solution to manage royalties for artists, managers,
            and administrators seamlessly.
            </p>
            <div className="space-x-4">
                <Link
                to="/login"
                className="bg-white text-teal-600 hover:bg-teal-600 hover:text-white px-6 py-3 rounded-xl font-semibold"
                >
                Login
                </Link>
                {/* <Link
                to="/register"
                className="bg-teal-700 text-white hover:bg-teal-800 px-6 py-3 rounded-xl font-semibold"
                >
                Register Now
                </Link> */}
            </div>
        </div>
    </div>
  );
};
 
export default HomePage;