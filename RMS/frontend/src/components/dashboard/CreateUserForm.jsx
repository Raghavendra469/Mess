import React, { useState } from "react";
import axios from "axios";

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    mobileNo: "",
    role: "Artist",
    address: "",
  });

  const [statusMessage, setStatusMessage] = useState(""); // State to store success/failure message
  const [statusType, setStatusType] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure role is properly formatted
    const formattedData = {
      ...formData,
      role: formData.role.charAt(0).toUpperCase() + formData.role.slice(1).toLowerCase(),
    };

    try {
      const response = await axios.post("http://localhost:3000/api/users", formattedData);

      if (response.status === 201) {
        setStatusMessage("User created successfully!");
        setStatusType("success");

        // Reset form after successful submission
        setFormData({
          username: "",
          fullName: "",
          email: "",
          password: "",
          mobileNo: "",
          role: "Artist",
          address: "",
        });
      } else {
        setStatusMessage(response.data.message || "Failed to create user");
        setStatusType("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage("Error creating user");
      setStatusType("error");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <header className="bg-white shadow-md py-4 px-6 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Create User Account</h1>
      </header>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter username"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter full name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobileNo">
              Phone Number
            </label>
            <input
              type="tel"
              id="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter phone number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Artist">Artist</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your address"
            />
          </div>

          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create User
          </button>

          {/* Display success or error message */}
          {statusMessage && (
            <p className={`mt-4 font-semibold ${statusType === "success" ? "text-green-600" : "text-red-600"}`}>
              {statusMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;
