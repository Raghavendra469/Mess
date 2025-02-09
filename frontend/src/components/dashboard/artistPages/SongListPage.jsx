import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/authContext";

const SongListPage = () => {
    const [songs, setSongs] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/auth/songs", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.data.success) {
                    setSongs(response.data.songs);
                }
            } catch (error) {
                console.error("Failed to fetch songs:", error);
            }
        };
        fetchSongs();
    }, []);

    // const handleToggleStatus = async (userId, isActive) => {
    //     try {
    //         const response = await axios.put(
    //             `http://localhost:3000/api/auth/users/${userId}`,
    //             { isActive },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                 },
    //             }
    //         );
    //         if (response.data.success) {
    //             setUsers(users.map(u => u._id === userId ? { ...u, isActive } : u));
    //         }
    //     } catch (error) {
    //         console.error("Failed to toggle user status:", error);
    //     }
    // };

    return (
        <div className="bg-gray-100 min-h-screen p-4">
            <header className="bg-white shadow-md py-4 px-6 mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Songs List</h1>
            </header>

            <div className="bg-white shadow-md rounded-lg p-6">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                        <th className="py-2">Song Id</th>
                            <th className="py-2">Song Title</th>
                            <th className="py-2">Release Date</th>
                            <th className="py-2">Collaborators</th>
                        </tr>
                    </thead>
                    <tbody>
                        {songs.map((song) => (
                            <tr key={song._id}>
                                <td className="border px-4 py-2">{song.songId}</td>
                                <td className="border px-4 py-2">{song.title}</td>
                                <td className="border px-4 py-2">{song.releaseDate}</td>
                                <td className="border px-4 py-2">{song.collaborators}</td>
                                {/* <td className="border px-4 py-2">
                                    {user.isActive ? (
                                        <span className="text-green-600">Active</span>
                                    ) : (
                                        <span className="text-red-600">Inactive</span>
                                    )}
                                </td> */}
                                {/* <td className="border px-4 py-2 space-x-2">
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
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SongListPage;