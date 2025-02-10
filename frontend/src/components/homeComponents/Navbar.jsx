import React from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll"; // Import for smooth scrolling

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-2">
          <div className="text-teal-600 text-2xl font-bold">
            Royalty Management
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-x-6">
          <ScrollLink
            to="home"
            smooth={true}
            duration={500}
            offset={-70}
            className="text-teal-600 hover:text-teal-800 font-semibold cursor-pointer"
          >
            Home
          </ScrollLink>

          <ScrollLink
            to="about-website"
            smooth={true}
            duration={500}
            offset={-70}
            className="text-teal-600 hover:text-teal-800 font-semibold cursor-pointer"
          >
            About
          </ScrollLink>

          <ScrollLink
            to="about-artist"
            smooth={true}
            duration={500}
            offset={-70}
            className="text-teal-600 hover:text-teal-800 font-semibold cursor-pointer"
          >
            Artist
          </ScrollLink>

          <ScrollLink
            to="about-manager"
            smooth={true}
            duration={500}
            offset={-70}
            className="text-teal-600 hover:text-teal-800 font-semibold cursor-pointer"
          >
            Manager
          </ScrollLink>

          <Link
            to="/login"
            className="text-teal-600 hover:text-teal-800 font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
