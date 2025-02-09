import React from "react";
import { Link } from "react-router-dom";

const LoginButton = () => {
  return (
    <div className="mb-8">
      <Link
        to="/login"
        className="bg-white text-teal-600 hover:bg-teal-600 hover:text-white px-6 py-3 rounded-xl font-semibold"
      >
        Login
      </Link>
    </div>
  );
};

export default LoginButton;
