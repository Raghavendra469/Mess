import React, { useState } from "react";
import SearchBar from "../../commonComponents/SearchBar";


const PerformanceTable = ({ users = [] }) => {
    const [searchTerm, setSearchTerm] = useState("");

    // Filtering by search term
    const filteredUsers = users.filter((user) =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-2">All {users[0].manager?"Artists":"Managers"}</h3>
            <SearchBar onSearch={setSearchTerm} />
            <div className="overflow-x-auto mt-4">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Total Streams</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Total Royalty ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((users, index) => (
                                <tr key={index} className="border border-gray-300">
                                    <td className="border px-4 py-2">{users.fullName || "Unknown"}</td>
                                    <td className="border px-4 py-2 text-center">{users.totalStreams || 0}</td>
                                    <td className="border px-4 py-2 text-center">
                                        ${(users.fullRoyalty || 0).toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-2">
                                    No user found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PerformanceTable;
