import React, { useState } from "react";
import { createUser } from "../../../services/userService";

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

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(formData);
      setStatusMessage(response.message || "User created successfully!");
      setStatusType("success");

      // Reset form
      setFormData({
        username: "",
        fullName: "",
        email: "",
        password: "",
        mobileNo: "",
        role: "Artist",
        address: "",
      });
    } catch (error) {
      setStatusMessage(error.message || "Error creating user");
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
          {["username", "fullName", "email", "password", "mobileNo", "address"].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}

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

          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create User
          </button>

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
