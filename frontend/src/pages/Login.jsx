import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth(); // Ensure this works
    const navigate = useNavigate();

    
    const validate = () => {
        let newErrors = [];
        if (!email) newErrors.push("Email is required");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.push("Invalid email address");
    
        if (!password) newErrors.push("Password is required");
        else if (password.length < 6) newErrors.push("Password must be at least 6 characters");
    
        setError(newErrors.join("\n")); // Convert array to string
        return newErrors.length === 0;
    };
    

    console.log(useAuth()); // Debug to check context value

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", {
                email,
                password,
            });
            if (response.data.success) {
                login(response.data.user); // Call `login` from context
                localStorage.setItem("token", response.data.token);
                console.log()
                if (response.data.user.role === "Admin" && !response.data.user.isFirstLogin) {
                    //  console.log("Entering login",response.data.user);
                    navigate("/admin-dashboard");
                } else if (response.data.user.role === "Manager" && !response.data.user.isFirstLogin) {
                    navigate("/manager-dashboard");
                } else if (response.data.user.role === "Artist" && !response.data.user.isFirstLogin){
                    // console.log("Entering login",response.data.user);
                    navigate("/artist-dashboard");
                }
                else if (response.data.user.isFirstLogin){
                    // console.log("Entering login",response.data.user);
                    navigate("/reset-password");
                }
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                setError(error.response.data.error);
            } else {
                setError("Server Error");
            }
        }
    };

    return (
        <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6 p-4">
            {/* Title */}
            <h2 className="font-cavet text-2xl sm:text-3xl md:text-4xl text-white text-center">
                Royalty Management System
            </h2>

            {/* Login Form */}
            <div className="border shadow p-6 w-full max-w-sm bg-white rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                            placeholder="Enter Email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {error.email && <p className="text-red-500 text-sm">{error.email}</p>}

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                            placeholder="*******"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                         {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                        <label className="inline-flex items-center">
                            <input type="checkbox" className="form-checkbox rounded" />
                            <span className="ml-2 text-gray-700">Remember me</span>
                        </label>
                        <Link
                            to="/forgot-password"
                            className="text-blue-500 hover:text-blue-700 underline text-sm"
                        >
                            Forgot Password
                        </Link>
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition duration-300"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <footer className="bg-gray-100 w-full py-4 mt-10">
                <div className="container mx-auto text-center text-teal-600 font-semibold text-sm sm:text-base">
                    &copy; 2025 Royalty Management System. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Login;