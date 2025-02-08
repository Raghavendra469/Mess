import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const DeleteUserForm = () => {
    const [users, setUsers] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/users/role/User", 
                //     {
                //     headers: {
                //         Authorization: `Bearer ${localStorage.getItem("token")}`,
                //     },
                // }
                );
                // console.log(response.data);
                if (response.data.success) {
                    setUsers(response.data.users);
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleToggleStatus = async (userId, isActive) => {
        try {
            const response = await axios.put(
                `http://localhost:3000/api/users/toggle/${userId}`,
                { isActive },
                // {
                //     headers: {
                //         Authorization: `Bearer ${localStorage.getItem("token")}`,
                //     },
                // }
            );
            if (response.data.success) {
                setUsers(users.map(u => u._id === userId ? { ...u, isActive } : u));
            }
        } catch (error) {
            console.error("Failed to toggle user status:", error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4">
            <header className="bg-white shadow-md py-4 px-6 mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
            </header>

            <div className="bg-white shadow-md rounded-lg p-6">
                {/* Table for larger screens */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Email</th>
                                <th className="py-2 px-4 text-left">Role</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">{user.username}</td>
                                    <td className="border px-4 py-2">{user.email}</td>
                                    <td className="border px-4 py-2">{user.role}</td>
                                    <td className="border px-4 py-2">
                                        {user.isActive ? (
                                            <span className="text-green-600">Active</span>
                                        ) : (
                                            <span className="text-red-600">Inactive</span>
                                        )}
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => handleToggleStatus(user._id, !user.isActive)}
                                            className={`px-4 py-1 rounded ${
                                                user.isActive
                                                    ? "bg-red-500 hover:bg-red-700 text-white"
                                                    : "bg-green-500 hover:bg-green-700 text-white"
                                            }`}
                                        >
                                            {user.isActive ? "Deactivate" : "Activate"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Card-based layout for smaller screens */}
                <div className="md:hidden space-y-4">
                    {users.map((user) => (
                        <div key={user._id} className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{user.name}</p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                                <span
                                    className={`px-2 py-1 text-sm rounded ${
                                        user.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                    }`}
                                >
                                    {user.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <div className="mt-2">
                                <p className="text-sm text-gray-600">Role: {user.role}</p>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => handleToggleStatus(user._id, !user.isActive)}
                                    className={`w-full px-4 py-2 rounded ${
                                        user.isActive
                                            ? "bg-red-500 hover:bg-red-700 text-white"
                                            : "bg-green-500 hover:bg-green-700 text-white"
                                    }`}
                                >
                                    {user.isActive ? "Deactivate" : "Activate"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DeleteUserForm;